"use client"

import Image from "next/image"
import Link from "next/link"
import type { Festival } from "@/lib/default-content"
import { Reveal } from "./reveal"

export function CultureBlog({ posts }: { posts: Festival[] }) {
  const displayPosts = posts.slice(0, 8)

  if (!displayPosts || displayPosts.length === 0) return null

  // Define span classes for a 4x4 dynamic bento grid on desktop
  const getSpanClasses = (i: number) => {
    switch (i) {
      case 0: return "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2"
      case 1: return "col-span-1 row-span-1"
      case 2: return "col-span-1 row-span-1"
      case 3: return "col-span-1 row-span-1"
      case 4: return "col-span-1 row-span-1"
      case 5: return "md:col-span-1 md:row-span-2 sm:col-span-2 sm:row-span-1 col-span-1 row-span-1"
      case 6: return "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-1 col-span-1 row-span-1"
      case 7: return "md:col-span-2 md:row-span-1 sm:col-span-1 sm:row-span-1 col-span-1 row-span-1"
      default: return "col-span-1 row-span-1"
    }
  }

  return (
    <section 
      id="van-hoa" 
      className="relative overflow-hidden bg-background px-5 py-24 sm:py-32"
    >
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[30vw] w-[30vw] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px] grid-flow-row-dense gap-4 md:gap-6">
            
            {/* Center Text Block (Forced to middle row on desktop) */}
            <div className="md:col-start-2 md:col-span-2 md:row-start-3 md:row-span-1 sm:col-span-2 sm:row-span-1 col-span-1 flex flex-col items-center justify-center text-center p-6 z-10 bg-secondary/30 rounded-3xl backdrop-blur-sm border border-border">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl uppercase tracking-widest text-foreground">
                Văn hóa
                <br />
                Trà Vinh
              </h2>
              <span className="text-sm sm:text-base tracking-[0.2em] text-muted-foreground uppercase mt-4 font-semibold">
                nét đẹp dân tộc
              </span>
            </div>

            {/* Random Scattered Images (Bento Grid) */}
            {displayPosts.map((post, i) => (
              <Link 
                href={`/van-hoa/${post.id}`} 
                key={post.id}
                className={`group relative block h-full w-full overflow-hidden rounded-3xl bg-secondary shadow-sm transition-all duration-500 hover:shadow-xl hover:z-20 ${getSpanClasses(i)}`}
              >
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                
                {/* Gradient Overlay appearing on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/0 opacity-100 transition-opacity duration-300 md:opacity-0 group-hover:opacity-100" />
                
                {/* Content fading in and sliding up on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-left opacity-100 transition-all duration-300 translate-y-0 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}

          </div>
        </Reveal>
      </div>
    </section>
  )
}
