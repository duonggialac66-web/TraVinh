"use server";

import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";

export async function loginOrRegister(formData: FormData, isLogin: boolean) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) return { error: "Vui lòng nhập đầy đủ thông tin" };

  try {
    if (isLogin) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return { error: "Email không tồn tại" };
      
      // Chú ý: Ở hệ thống thật, password phải được so sánh qua bcrypt!
      if (user.password !== password) return { error: "Sai mật khẩu" };

      await setSession(user.id);
      return { success: true };
    } else {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return { error: "Email đã được sử dụng" };

      const user = await prisma.user.create({
        data: {
          email,
          password, // Ở hệ thống thật, dùng bcrypt để hash!
          name: name || "User",
        },
      });

      await setSession(user.id);
      return { success: true };
    }
  } catch (error) {
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." };
  }
}
