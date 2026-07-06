import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import { getLandingData } from "@/lib/content"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default async function CulturePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { festivals, content } = await getLandingData()
  const post = festivals.find((f) => f.id === id)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background pb-0">
      <Navbar />
      
      <article className="pt-20 sm:pt-24">
        {/* Header Hero */}
        <header className="relative h-[50vh] min-h-[400px] w-full bg-secondary">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradients to blend image with background color */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
          
          <div className="absolute inset-0 mx-auto flex max-w-4xl flex-col justify-end px-5 pb-12 sm:pb-20">
            <Link 
              href="/#van-hoa"
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:bg-background hover:scale-105"
            >
              <ArrowLeft className="size-4" />
              Quay lại trang chủ
            </Link>
            
            {post.season && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg backdrop-blur-md">
                <Calendar className="size-4" />
                {post.season}
              </div>
            )}
            
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {post.title}
            </h1>
          </div>
        </header>

        {/* Content Body */}
        <div className="mx-auto max-w-3xl px-5 py-12 sm:py-24">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-content" />
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
    </main>
  )
}
