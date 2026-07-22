"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateUserProfile(data: { name?: string; password?: string; newPassword?: string; image?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    const updateData: any = {};
    if (data.name) updateData.name = data.name;

    if (data.image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(data.image, {
          folder: "tra-vinh-users",
        });
        updateData.image = uploadResponse.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return { success: false, error: "Lỗi khi tải ảnh lên" };
      }
    }

    if (data.password && data.newPassword) {
      if (!user.password) {
        return { success: false, error: "Account logged in via Google cannot change password this way" };
      }
      
      const isPasswordValid = bcrypt.compareSync(data.password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: "Mật khẩu hiện tại không đúng" };
      }
      
      const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update profile" };
  }
}
