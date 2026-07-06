"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import type { Location } from "@/lib/default-content"
import { ArrowUpRight } from "lucide-react"

export function Locations({ locations }: { locations: Location[] }) {
  return (
    <section id="dia-diem" className="bg-[#111111] text-white px-5 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-white/40" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  Điểm đến
                </span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mt-6 font-serif text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[1.05] tracking-tight">
                Dấu ấn <span className="italic text-white/60">Trà Vinh</span>
              </h2>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
          >
            <p className="max-w-sm text-right text-base font-light leading-relaxed text-white/50">
              Khám phá những địa danh mang đậm đà bản sắc văn hóa và vẻ đẹp thiên nhiên hoang sơ của vùng đất trù phú miền Tây.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row h-[75vh] min-h-[600px] w-full gap-4">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 200, scale: 0.85, rotateX: 15, rotateZ: i % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 1.4, 
                delay: i * 0.15, 
                ease: [0.16, 1, 0.3, 1] // Dramatic ease out
              }}
              className="group relative flex-1 overflow-hidden rounded-[2rem] bg-zinc-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:flex-[3] lg:hover:flex-[4] focus-within:flex-[3] lg:focus-within:flex-[4] origin-bottom perspective-[1000px]"
            >
              <Link href={`/dia-diem/${loc.id}`} className="block h-full w-full relative">
                <Image
                  src={loc.image || "/placeholder.svg"}
                  alt={loc.title}
                  fill
                  className="object-cover opacity-60 grayscale-[30%] transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />
                
                {/* Collapsed State: Vertical Text (Visible on desktop when not hovered) */}
                <div className="absolute inset-0 hidden flex-col items-center justify-end p-8 lg:flex lg:opacity-100 lg:group-hover:opacity-0 transition-opacity duration-500">
                  <h3 className="font-serif text-3xl font-medium tracking-wide text-white" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    {loc.title}
                  </h3>
                </div>

                {/* Expanded State / Mobile State: Full Content */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 sm:p-8 lg:translate-y-8 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <div className="mb-6 w-fit rounded-full border border-white/20 bg-black/30 px-4 py-1.5 backdrop-blur-md">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                      {loc.tag}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <h3 className="font-serif text-3xl font-medium text-white sm:text-4xl">
                        {loc.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-white/70 line-clamp-2">
                        {loc.description}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:-rotate-45 sm:group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
