"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { verifyCredentials, createSession, destroySession } from "@/lib/auth"
import {
  updateSiteContent,
  upsertLocation,
  deleteLocation,
  upsertFestival,
  deleteFestival,
  upsertFood,
  deleteFood,
  upsertGalleryImage,
  deleteGalleryImage,
  upsertTour,
  deleteTour,
  upsertProduct,
  deleteProduct,
} from "@/lib/content"
import crypto from "crypto"

export async function getCloudinarySignatureAction() {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.CLOUDINARY_API_KEY
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME

  if (!apiSecret || !apiKey || !cloudName) {
    throw new Error("Thiếu cấu hình Cloudinary (CLOUDINARY_API_SECRET, v.v...) trong .env")
  }

  // Chú ý: cloudinary yêu cầu sort các parameter theo alphabet trước khi hash.
  // Ở dạng đơn giản nhất không có tham số nào khác, string cần hash là: `timestamp=${timestamp}${apiSecret}`
  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex")

  return { timestamp, signature, apiKey, cloudName }
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  const ok = verifyCredentials(email, password)
  if (!ok) {
    return { error: "Email hoặc mật khẩu không đúng." }
  }
  await createSession()
  redirect("/admin")
}

export async function logoutAction() {
  await destroySession()
  redirect("/admin/login")
}

export async function saveSiteContentAction(_prev: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  await updateSiteContent(data as Record<string, string>)
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function saveLocationAction(_prev: unknown, formData: FormData) {
  await upsertLocation({
    id: (formData.get("id") as string) || undefined,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    content: String(formData.get("content") ?? ""),
    image: String(formData.get("image") ?? ""),
    tag: String(formData.get("tag") ?? ""),
    order: Number(formData.get("order") ?? 0),
  })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function removeLocationAction(formData: FormData) {
  await deleteLocation(String(formData.get("id")))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function saveFestivalAction(_prev: unknown, formData: FormData) {
  await upsertFestival({
    id: (formData.get("id") as string) || undefined,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    content: String(formData.get("content") ?? ""),
    image: String(formData.get("image") ?? ""),
    season: String(formData.get("season") ?? ""),
    order: Number(formData.get("order") ?? 0),
  })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function removeFestivalAction(formData: FormData) {
  await deleteFestival(String(formData.get("id")))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function saveFoodAction(_prev: unknown, formData: FormData) {
  await upsertFood({
    id: (formData.get("id") as string) || undefined,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    order: Number(formData.get("order") ?? 0),
  })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function removeFoodAction(formData: FormData) {
  await deleteFood(String(formData.get("id")))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function saveGalleryAction(_prev: unknown, formData: FormData) {
  await upsertGalleryImage({
    id: (formData.get("id") as string) || undefined,
    image: String(formData.get("image") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    order: Number(formData.get("order") ?? 0),
  })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function removeGalleryAction(formData: FormData) {
  await deleteGalleryImage(String(formData.get("id")))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function saveTourAction(_prev: unknown, formData: FormData) {
  await upsertTour({
    id: (formData.get("id") as string) || undefined,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    image: String(formData.get("image") ?? ""),
    order: Number(formData.get("order") ?? 0),
  })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function removeTourAction(formData: FormData) {
  await deleteTour(String(formData.get("id")))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function saveProductAction(_prev: unknown, formData: FormData) {
  await upsertProduct({
    id: (formData.get("id") as string) || undefined,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    image: String(formData.get("image") ?? ""),
    order: Number(formData.get("order") ?? 0),
  })
  revalidatePath("/")
  revalidatePath("/admin")
  return { ok: true, savedAt: Date.now() }
}

export async function removeProductAction(formData: FormData) {
  await deleteProduct(String(formData.get("id")))
  revalidatePath("/")
  revalidatePath("/admin")
}
