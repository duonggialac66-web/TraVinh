import { prisma, isDatabaseConfigured } from "@/lib/prisma"
import {
  defaultSiteContent,
  defaultLocations,
  defaultFestivals,
  defaultFoods,
  defaultGallery,
  defaultTours,
  defaultProducts,
  type SiteContent,
  type Location,
  type Festival,
  type Food,
  type GalleryImage,
  type Tour,
  type Product,
} from "@/lib/default-content"

export type LandingData = {
  content: SiteContent
  locations: Location[]
  festivals: Festival[]
  foods: Food[]
  gallery: GalleryImage[]
  tours: Tour[]
  products: Product[]
  usingFallback: boolean
}

const fallbackData: LandingData = {
  content: defaultSiteContent,
  locations: defaultLocations,
  festivals: defaultFestivals,
  foods: defaultFoods,
  gallery: defaultGallery,
  tours: defaultTours,
  products: defaultProducts,
  usingFallback: true,
}

/**
 * Lấy toàn bộ dữ liệu cho trang landing.
 */
export async function getLandingData(): Promise<LandingData> {
  if (!isDatabaseConfigured) {
    return fallbackData
  }

  try {
    const [content, locations, festivals, foods, gallery, tours, products] = await Promise.all([
      prisma.siteContent.findUnique({ where: { id: "singleton" } }),
      prisma.location.findMany({ orderBy: { order: "asc" } }),
      prisma.festival.findMany({ orderBy: { order: "asc" } }),
      prisma.food.findMany({ orderBy: { order: "asc" } }),
      prisma.galleryImage.findMany({ orderBy: { order: "asc" } }),
      prisma.tour.findMany({ orderBy: { order: "asc" } }),
      prisma.product.findMany({ orderBy: { order: "asc" } }),
    ])

    return {
      content: content ?? defaultSiteContent,
      locations: locations.length ? locations : defaultLocations,
      festivals: festivals.length ? festivals : defaultFestivals,
      foods: foods.length ? foods : defaultFoods,
      gallery: gallery.length ? gallery : defaultGallery,
      tours: tours.length ? tours : defaultTours,
      products: products.length ? products : defaultProducts,
      usingFallback: false,
    }
  } catch (error) {
    console.log("[v0] getLandingData fallback:", (error as Error).message)
    return fallbackData
  }
}

/** Đảm bảo bản ghi SiteContent singleton tồn tại rồi trả về. */
export async function ensureSiteContent(): Promise<SiteContent> {
  const existing = await prisma.siteContent.findUnique({
    where: { id: "singleton" },
  })
  if (existing) return existing

  return prisma.siteContent.create({
    data: { id: "singleton", ...defaultSiteContent },
  })
}

function assertDb() {
  if (!isDatabaseConfigured) {
    throw new Error(
      "Chưa kết nối Neon. Vui lòng thêm DATABASE_URL rồi chạy `pnpm db:push` và `pnpm db:seed` để lưu chỉnh sửa.",
    )
  }
}

/* ------------------------- Site content ------------------------- */
export async function updateSiteContent(data: Record<string, string>) {
  assertDb()
  const fields: (keyof SiteContent)[] = [
    "heroKicker",
    "heroTitle",
    "heroSubtitle",
    "heroImage",
    "aboutHeading",
    "aboutBody",
    "contactHeading",
    "contactBody",
    "contactEmail",
    "contactPhone",
    "mapEmbedUrl",
  ]
  const payload: Record<string, string> = {}
  for (const f of fields) {
    if (typeof data[f] === "string") payload[f] = data[f]
  }
  return prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: payload,
    create: { id: "singleton", ...defaultSiteContent, ...payload },
  })
}

/* ------------------------- Locations ------------------------- */
export async function upsertLocation(input: Partial<Location> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  if (id) {
    return prisma.location.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Location, "id">) },
    })
  }
  return prisma.location.create({ data: data as Omit<Location, "id"> })
}

export async function deleteLocation(id: string) {
  assertDb()
  return prisma.location.delete({ where: { id } })
}

/* ------------------------- Festivals ------------------------- */
export async function upsertFestival(input: Partial<Festival> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  if (id) {
    return prisma.festival.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Festival, "id">) },
    })
  }
  return prisma.festival.create({ data: data as Omit<Festival, "id"> })
}

export async function deleteFestival(id: string) {
  assertDb()
  return prisma.festival.delete({ where: { id } })
}

/* ------------------------- Foods ------------------------- */
export async function upsertFood(input: Partial<Food> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  if (id) {
    return prisma.food.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Food, "id">) },
    })
  }
  return prisma.food.create({ data: data as Omit<Food, "id"> })
}

export async function deleteFood(id: string) {
  assertDb()
  return prisma.food.delete({ where: { id } })
}

/* ------------------------- Gallery ------------------------- */
export async function upsertGalleryImage(input: Partial<GalleryImage> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  if (id) {
    return prisma.galleryImage.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<GalleryImage, "id">) },
    })
  }
  return prisma.galleryImage.create({ data: data as Omit<GalleryImage, "id"> })
}

export async function deleteGalleryImage(id: string) {
  assertDb()
  return prisma.galleryImage.delete({ where: { id } })
}

/* ------------------------- Tours ------------------------- */
export async function upsertTour(input: Partial<Tour> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  if (id) {
    return prisma.tour.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Tour, "id">) },
    })
  }
  return prisma.tour.create({ data: data as Omit<Tour, "id"> })
}

export async function deleteTour(id: string) {
  assertDb()
  return prisma.tour.delete({ where: { id } })
}

/* ------------------------- Products ------------------------- */
export async function upsertProduct(input: Partial<Product> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  if (id) {
    return prisma.product.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Product, "id">) },
    })
  }
  return prisma.product.create({ data: data as Omit<Product, "id"> })
}

export async function deleteProduct(id: string) {
  assertDb()
  return prisma.product.delete({ where: { id } })
}
