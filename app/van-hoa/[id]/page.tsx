import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import { getLandingData } from "@/lib/content"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export async function generateStaticParams() {
  const { festivals } = await getLandingData()
  return festivals.map((f) => ({ id: f.id }))
}

export default async function CulturePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { festivals, content } = await getLandingData()
  const post = festivals.find((f) => f.id === id)

  if (!post) {
    notFound()
  }

  return (
    <main className="relative min-h-screen bg-[#F9F8F6] pb-0 overflow-hidden">
      {/* Background chìm trang trí (Soft editorial blobs) */}
      <div className="pointer-events-none absolute left-0 top-[30%] z-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[#EAE8E3] opacity-60 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-[70%] z-0 h-[600px] w-[600px] translate-x-1/3 rounded-full bg-[#EAE8E3] opacity-60 blur-[100px]" />

      <div className="relative z-10">
        <Navbar />
      
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="mb-8">
          <Link 
            href="/#van-hoa"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="size-4" /> Quay lại trang chủ
          </Link>
        </div>
        
        <div className="mb-10">
          {post.season && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Calendar className="size-4" />
              {post.season}
            </div>
          )}
          
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-3xl">
            {post.description}
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full mb-12 rounded-3xl overflow-hidden shadow-lg border border-border/50">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            {post.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }} 
                className="blog-content [&_img]:max-w-full [&_img]:w-full [&_img]:h-auto [&_img]:rounded-3xl [&_img]:border [&_img]:border-border [&_img]:shadow-md [&_img]:my-10 [&_img]:object-cover [&_p]:break-words [&_p]:mb-6 [&_p]:leading-relaxed [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-primary [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:font-medium" 
              />
            ) : (
              <>
                {/* Adding a drop cap for the first letter of the first paragraph for an editorial feel */}
                {post.description.split('\n').map((paragraph, idx) => {
                  if (!paragraph.trim()) return null;
                  
                  if (idx === 0) {
                    return (
                      <p key={idx} className="leading-relaxed text-muted-foreground text-xl sm:text-2xl font-serif">
                        <span className="float-left mr-4 text-7xl font-bold text-primary leading-none mt-2">
                          {paragraph.charAt(0)}
                        </span>
                        {paragraph.substring(1)}
                      </p>
                    )
                  }

                  return (
                    <p key={idx} className="leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  )
                })}
              </>
            )}
          </div>
          
          <div className="mt-16 flex justify-center border-t border-border pt-12">
            <Link 
              href="/#van-hoa"
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Xem các bài viết khác
            </Link>
          </div>
        </div>
      </article>

      <Footer />
      </div>
    </main>
  )
}
