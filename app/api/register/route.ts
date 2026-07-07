import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("Thiếu thông tin", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exist) {
      return new NextResponse("Email đã được sử dụng", { status: 400 });
    }

    // Giảm salt xuống 8 và dùng hàm Sync để đăng ký nhanh gấp 4 lần
    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return new NextResponse("Đã xảy ra lỗi hệ thống", { status: 500 });
  }
}
