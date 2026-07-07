import { prisma, isDatabaseConfigured } from "@/lib/prisma"
import { unstable_cache, revalidateTag } from "next/cache"
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

const getCachedLandingData = unstable_cache(
  async () => {
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
  },
  ['landing-data'],
  { revalidate: 3600, tags: ['content'] }
)

/**
 * Lấy toàn bộ dữ liệu cho trang landing.
 */
export async function getLandingData(): Promise<LandingData> {
  if (!isDatabaseConfigured) {
    return fallbackData
  }

  try {
    return await getCachedLandingData()
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
  const res = await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: payload,
    create: { id: "singleton", ...defaultSiteContent, ...payload },
  })
  revalidateTag('content')
  return res
}

/* ------------------------- Locations ------------------------- */
export async function upsertLocation(input: Partial<Location> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  let res
  if (id) {
    res = await prisma.location.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Location, "id">) },
    })
  } else {
    res = await prisma.location.create({ data: data as Omit<Location, "id"> })
  }
  revalidateTag('content')
  return res
}

export async function deleteLocation(id: string) {
  assertDb()
  const res = await prisma.location.delete({ where: { id } })
  revalidateTag('content')
  return res
}

/* ------------------------- Festivals ------------------------- */
export async function upsertFestival(input: Partial<Festival> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  let res
  if (id) {
    res = await prisma.festival.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Festival, "id">) },
    })
  } else {
    res = await prisma.festival.create({ data: data as Omit<Festival, "id"> })
  }
  revalidateTag('content')
  return res
}

export async function deleteFestival(id: string) {
  assertDb()
  const res = await prisma.festival.delete({ where: { id } })
  revalidateTag('content')
  return res
}

/* ------------------------- Foods ------------------------- */
export async function upsertFood(input: Partial<Food> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  let res
  if (id) {
    res = await prisma.food.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Food, "id">) },
    })
  } else {
    res = await prisma.food.create({ data: data as Omit<Food, "id"> })
  }
  revalidateTag('content')
  return res
}

export async function deleteFood(id: string) {
  assertDb()
  const res = await prisma.food.delete({ where: { id } })
  revalidateTag('content')
  return res
}

/* ------------------------- Gallery ------------------------- */
export async function upsertGalleryImage(input: Partial<GalleryImage> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  let res
  if (id) {
    res = await prisma.galleryImage.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<GalleryImage, "id">) },
    })
  } else {
    res = await prisma.galleryImage.create({ data: data as Omit<GalleryImage, "id"> })
  }
  revalidateTag('content')
  return res
}

export async function deleteGalleryImage(id: string) {
  assertDb()
  const res = await prisma.galleryImage.delete({ where: { id } })
  revalidateTag('content')
  return res
}

/* ------------------------- Tours ------------------------- */
export async function upsertTour(input: Partial<Tour> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  let res
  if (id) {
    res = await prisma.tour.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Tour, "id">) },
    })
  } else {
    res = await prisma.tour.create({ data: data as Omit<Tour, "id"> })
  }
  revalidateTag('content')
  return res
}

export async function deleteTour(id: string) {
  assertDb()
  const res = await prisma.tour.delete({ where: { id } })
  revalidateTag('content')
  return res
}

/* ------------------------- Products ------------------------- */
export async function upsertProduct(input: Partial<Product> & { id?: string }) {
  assertDb()
  const { id, ...data } = input
  let res
  if (id) {
    res = await prisma.product.upsert({
      where: { id },
      update: data,
      create: { id, ...(data as Omit<Product, "id">) },
    })
  } else {
    res = await prisma.product.create({ data: data as Omit<Product, "id"> })
  }
  revalidateTag('content')
  return res
}

export async function deleteProduct(id: string) {
  assertDb()
  const res = await prisma.product.delete({ where: { id } })
  revalidateTag('content')
  return res
}
