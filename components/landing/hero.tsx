"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowDown } from "lucide-react"
import type { SiteContent } from "@/lib/default-content"

export function Hero({ content }: { content: SiteContent }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.75])

  const title = content.heroTitle

    // Tự động tối ưu dung lượng video trên Cloudinary nhưng giữ nguyên kích thước gốc
    const getOptimizedVideoUrl = (url: string) => {
      if (url && url.includes("cloudinary.com") && url.includes("/upload/")) {
        return url.replace("/upload/", "/upload/q_auto/") // Bỏ giới hạn width để lấy kích thước gốc
      }
      return url
    }
  
    return (
      <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
          {(content.heroImage?.match(/\.(mp4|webm|ogg)$/i) || content.heroImage?.includes("video/upload")) ? (
            <video
              src={getOptimizedVideoUrl(content.heroImage)}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={content.heroImage || "/images/hero-tra-vinh.png"}
              alt="Cảnh quan sông nước Trà Vinh"
              fill
              priority
              loading="eager"
              className="object-cover"
            />
          )}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background/50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </motion.div>
  
        <motion.div
          style={{ y: textY }}
          className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="mb-4 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-foreground/90"
            >
              <span className="h-px w-10 bg-accent" />
              {content.heroKicker}
              <span className="h-px w-10 bg-accent" />
            </motion.p>
  
            <h1 className="font-serif text-[clamp(8rem,30vw,24rem)] font-semibold leading-[0.8] tracking-tighter text-primary-foreground drop-shadow-2xl">
              <motion.span
                initial={{ opacity: 0, filter: "blur(24px)", scale: 0.8 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                transition={{
                  duration: 1.5,
                  delay: 0.2,
                  ease: [0.25, 1, 0.5, 1]
                }}
                className="inline-block"
              >
                84
              </motion.span>
            </h1>
  
            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="mt-6 max-w-xl text-pretty text-lg sm:text-xl font-light leading-relaxed text-primary-foreground/90"
            >
              {content.heroSubtitle}
            </motion.p>
          </motion.div>
        </motion.div>
  
        <motion.a
          href="#gioi-thieu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-[10%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-primary font-medium"
        >
            <ArrowDown className="size-4 animate-bounce" />
        </motion.a>
        
        {/* Soft elegant arch wave */}
        <div className="absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[60px] md:h-[100px] block">
            <path fill="currentColor" className="text-background" d="M0,100 C480,0 960,0 1440,100 Z"></path>
          </svg>
        </div>
      </section>
    )
}
