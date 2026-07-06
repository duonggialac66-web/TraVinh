"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { Reveal } from "./reveal"
import type { GalleryImage } from "@/lib/default-content"

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null)

  return (
    <section id="thu-vien" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Thư viện ảnh
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 max-w-xl text-balance font-serif text-4xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
              Khoảnh khắc Trà Vinh
            </h2>
          </Reveal>
        </div>

        <div className="columns-2 gap-4 md:columns-3">
          {images.map((img, i) => (
            <Reveal key={img.id} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid">
              <button
                onClick={() => setActive(img)}
                className={`group relative block w-full overflow-hidden rounded-3xl border border-border ${
                  i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={img.image || "/placeholder.svg"}
                  alt={img.caption || "Ảnh Trà Vinh"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-serif text-lg italic text-primary-foreground">
                    {img.caption}
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-background text-foreground"
              aria-label="Đóng"
            >
              <X className="size-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl"
            >
              <Image
                src={active.image || "/placeholder.svg"}
                alt={active.caption || "Ảnh Trà Vinh"}
                width={1200}
                height={1500}
                className="h-auto max-h-[85vh] w-full object-contain"
              />
              {active.caption && (
                <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-1.5 font-serif italic text-foreground">
                  {active.caption}
                </span>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
