import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'   

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://travinh.example.com'

  // Dynamic locations from DB (nếu có các trang chi tiết /dia-diem/[id])
  // const locations = await prisma.location.findMany({ select: { id: true, updatedAt: true } })
  // const locationUrls = locations.map(loc => ({
  //   url: `${baseUrl}/dia-diem/${loc.id}`,
  //   lastModified: loc.updatedAt,
  // }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
