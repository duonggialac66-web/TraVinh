import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma, isDatabaseConfigured } from "@/lib/prisma"
import { defaultLocations } from "@/lib/default-content"
import { Navbar } from "@/components/landing/navbar"
import { getLandingData } from "@/lib/content"
import { Tours } from "@/components/landing/tours"
import { Footer } from "@/components/landing/footer"

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

      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src={location.image || "/placeholder.svg"}
          alt={location.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-5 -mt-32 relative z-10">
        <Link 
          href="/#dia-diem" 
          className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary mb-6 shadow-sm border border-border"
        >
          <ArrowLeft className="size-4" /> Về trang chủ
        </Link>
        
        <div className="rounded-[2.5rem] bg-card p-8 sm:p-12 shadow-2xl border border-border">
          <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground">
            {location.tag}
          </span>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground sm:text-6xl mb-6">
            {location.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-8">
            {location.description}
          </p>
          
          <div className="h-px w-full bg-border mb-8" />
          
          <div 
            className="prose prose-lg dark:prose-invert prose-headings:font-serif max-w-none text-foreground/90 break-words
            [&_img]:!max-w-full [&_img]:!w-full [&_img]:!h-auto [&_img]:rounded-3xl [&_img]:border [&_img]:border-border [&_img]:shadow-md [&_img]:my-8 [&_img]:object-cover 
            [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-primary 
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-medium 
            [&_p]:mb-4 [&_p]:leading-relaxed whitespace-pre-wrap"
          >
            {location.content ? (
              <div dangerouslySetInnerHTML={{ __html: location.content }} />
            ) : (
              <p className="italic text-muted-foreground">Nội dung chi tiết đang được cập nhật...</p>
            )}
          </div>
        </div>
      </div>

      {/* Book Tour Section */}
      <div className="mt-16">
        <Tours tours={tours} title={<>Đặt tour <br/><span className="text-primary italic">Ngay</span></>} subtitle="Chọn ngay một lịch trình yêu thích để bắt đầu hành trình khám phá và tận hưởng vẻ đẹp tuyệt vời của vùng đất này cùng chúng tôi." />
      </div>
      <Footer/>
    </main>
  )
}
