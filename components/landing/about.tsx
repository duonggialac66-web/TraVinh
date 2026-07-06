"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"
import type { SiteContent } from "@/lib/default-content"

const stats = [
  { value: "143", label: "Ngôi chùa Khmer" },
  { value: "65km", label: "Đường bờ biển" },
  { value: "1900", label: "Năm lịch sử" },
]

export function About({ content }: { content: SiteContent }) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Parallax effects cho hình ảnh
  const yImage1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const yImage2 = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section id="gioi-thieu" ref={containerRef} className="relative overflow-hidden bg-background px-5 py-24 sm:py-32">
      {/* Background texture nhẹ */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "url('/images/paper-texture.png')" }} />
      
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center xl:gap-24">
          
          {/* Left Content - Typography */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary/40" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Câu chuyện Trà Vinh
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-8 font-serif text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[1.05] tracking-tight text-foreground">
                <span className="block">Hòa quyện giữa</span>
                <span className="block italic text-primary">Thiên nhiên & Tâm linh</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10">
                <p className={`text-lg font-light leading-relaxed text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${expanded ? "" : "line-clamp-4"}`}>
                  {content.aboutBody}
                </p>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="group mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
                >
                  <span className="relative overflow-hidden pb-1">
                    {expanded ? "Thu gọn" : "Đọc tiếp"}
                    <span className="absolute bottom-0 left-0 h-[1px] w-full origin-left bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </span>
                  <ArrowRight className={`h-4 w-4 transition-transform duration-500 ease-out ${expanded ? "-rotate-90" : "group-hover:translate-x-2"}`} />
                </button>
              </div>
            </Reveal>

            <div className="mt-16 grid grid-cols-3 gap-6 divide-x divide-border border-t border-border pt-12">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.3 + i * 0.1}>
                  <div className="pl-6 first:pl-0">
                    <div className="font-serif text-3xl font-light tracking-tighter text-foreground sm:text-5xl">{s.value}</div>
                    <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right Content - Editorial Images */}
          <div className="relative h-[600px] w-full sm:h-[800px] lg:h-[900px]">
            {/* Background shape */}
            <div className="absolute right-0 top-1/2 h-[80%] w-[80%] -translate-y-1/2 rounded-[3rem] bg-secondary/50" />
            
            {/* Main Image 1 */}
            <motion.div style={{ y: yImage1 }} className="absolute left-0 top-8 h-[55%] w-[65%] overflow-hidden rounded-[2rem] shadow-2xl xl:left-[-10%]">
              <Image
                src="/images/gallery-coconut-road.png"
                alt="Đường quê"
                fill
                className="object-cover transition-transform duration-[2s] hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            
            {/* Main Image 2 */}
            <motion.div style={{ y: yImage2 }} className="absolute bottom-8 right-0 h-[50%] w-[55%] overflow-hidden rounded-[2rem] border-8 border-background shadow-2xl">
              <Image
                src="/images/chua-ang.png"
                alt="Chùa Âng"
                fill
                className="object-cover transition-transform duration-[2s] hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            
            {/* Minimalist Floating Badge */}
            <Reveal delay={0.5} className="absolute left-[45%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-primary/20 bg-background/70 backdrop-blur-md shadow-xl">
                <p className="text-center font-serif text-sm font-medium italic leading-tight text-primary">
                  Vẻ đẹp<br/>Bình dị
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
