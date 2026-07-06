"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function checkoutCart(formData: FormData, items: Array<{ id: string, title: string, price: number, quantity: number }>, totalAmount: number) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const customerNote = formData.get("customerNote") as string;

  if (!customerName || !customerPhone) {
    return { error: "Vui lòng nhập đầy đủ họ tên và số điện thoại." };
  }

  const session = await getSession();
  if (!session?.userId) {
    return { error: "UNAUTHORIZED" };
  }
  const userId = session.userId;

  try {
    const order = await prisma.productOrder.create({
      data: {
        userId,
        customerName,
        customerPhone,
        customerNote,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.id,
            productName: item.title,
            price: item.price,
            quantity: item.quantity
          }))
        }
      },
    });
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error(error);
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}

export async function bookTour(formData: FormData, tourId: string, tourName: string, priceString: string) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const tourDate = formData.get("tourDate") as string;
  const participants = parseInt(formData.get("participants") as string) || 1;
  const customerNote = formData.get("customerNote") as string;

  if (!customerName || !customerPhone || !tourDate) {
    return { error: "Vui lòng nhập đầy đủ thông tin bắt buộc." };
  }

  // Lấy số từ chuỗi giá (nếu có)
  const numericPrice = parseInt(priceString.replace(/\D/g, "")) || 0;
  const totalAmount = numericPrice * participants;

  const session = await getSession();
  if (!session?.userId) {
    return { error: "UNAUTHORIZED" };
  }
  const userId = session.userId;

  try {
    const order = await prisma.tourBooking.create({
      data: {
        userId,
        tourId,
        tourName,
        tourDate,
        participants,
        customerName,
        customerPhone,
        customerNote,
        totalAmount,
        status: "PENDING",
      },
    });
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error(error);
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
