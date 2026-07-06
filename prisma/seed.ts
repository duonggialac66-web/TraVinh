import { PrismaClient } from "../generated/prisma"
import {
  defaultSiteContent,
  defaultLocations,
  defaultFestivals,
  defaultFoods,
  defaultGallery,
} from "../lib/default-content"

const prisma = new PrismaClient()

async function main() {
  console.log("Đang nạp dữ liệu mẫu cho Trà Vinh...")

  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...defaultSiteContent },
  })

  await prisma.location.deleteMany()
  for (const loc of defaultLocations) {
    const { id: _id, ...data } = loc
    await prisma.location.create({ data })
  }

  await prisma.festival.deleteMany()
  for (const fes of defaultFestivals) {
    const { id: _id, ...data } = fes
    await prisma.festival.create({ data })
  }

  await prisma.food.deleteMany()
  for (const food of defaultFoods) {
    const { id: _id, ...data } = food
    await prisma.food.create({ data })
  }

  await prisma.galleryImage.deleteMany()
  for (const img of defaultGallery) {
    const { id: _id, ...data } = img
    await prisma.galleryImage.create({ data })
  }

  console.log("Hoàn tất nạp dữ liệu mẫu.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
