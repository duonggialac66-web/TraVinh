import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma, isDatabaseConfigured } from "@/lib/prisma"
import { defaultLocations } from "@/lib/default-content"
import { Navbar } from "@/components/landing/navbar"
import { getLandingData } from "@/lib/content"
import { ToursGrid } from "@/components/landing/tours-grid"
import { Footer } from "@/components/landing/footer"

export async function generateStaticParams() {
  const { locations } = await getLandingData()
  return locations.map((loc) => ({ id: loc.id }))
}

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const { tours } = await getLandingData()
  
  let location = null
  if (isDatabaseConfigured) {
    location = await prisma.location.findUnique({ where: { id } })
  }
  
  if (!location) {
    location = defaultLocations.find((l) => l.id === id) || null
  }

  if (!location) {
    notFound()
  }

  return (
    <main className="relative min-h-screen bg-background pb-0">
      <Navbar />

      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="mb-8">
          <Link 
            href="/#dia-diem" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="size-4" /> Về trang chủ
          </Link>
        </div>
        
        <div className="mb-10">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
            {location.tag}
          </span>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl mb-6">
            {location.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-3xl">
            {location.description}
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full mb-12 rounded-3xl overflow-hidden shadow-lg border border-border">
          <Image
            src={location.image || "/placeholder.svg"}
            alt={location.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        
        <div className="mx-auto max-w-5xl">
          <div 
            className="prose prose-lg dark:prose-invert prose-headings:font-serif max-w-none text-foreground/90 break-words
            [&_img]:!max-w-full [&_img]:!w-full [&_img]:!h-auto [&_img]:rounded-3xl [&_img]:border [&_img]:border-border [&_img]:shadow-md [&_img]:my-8 [&_img]:object-cover 
            [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-primary 
            [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-medium 
            [&_p]:mb-6 [&_p]:leading-relaxed whitespace-pre-wrap"
          >
            {location.content ? (
              <div dangerouslySetInnerHTML={{ __html: location.content }} />
            ) : (
              <p className="italic text-muted-foreground py-10">Nội dung chi tiết đang được cập nhật...</p>
            )}
          </div>
        </div>
      </article>

      {/* Book Tour Section */}
      <div className="mt-10 bg-secondary/30 py-16">
        <ToursGrid tours={tours} title={<>Đặt tour <br/><span className="text-primary italic">Ngay</span></>} subtitle="Chọn ngay một lịch trình yêu thích để bắt đầu hành trình khám phá và tận hưởng vẻ đẹp tuyệt vời của vùng đất này cùng chúng tôi." />
      </div>
      <Footer/>
    </main>
  )
}
