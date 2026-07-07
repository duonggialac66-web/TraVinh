"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/lib/default-content"
import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Great_Vibes } from "next/font/google"

const scriptFont = Great_Vibes({ 
  subsets: ["vietnamese", "latin"], 
  weight: ["400"] 
})

export function Products({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const { addItem } = useCartStore()

  function handleAddToCart(product: Product) {
    // Parse price string (e.g., "150.000đ") to number
    const numericPrice = parseInt(product.price.replace(/\D/g, "")) || 0
    addItem({
      id: product.id,
      title: product.title,
      price: numericPrice,
      image: product.image
    })
  }

  if (!products || products.length === 0) return null

  return (
    <section id="products" ref={containerRef} className="relative w-full overflow-hidden bg-[#EAE8E3] py-16 sm:py-24">
      <motion.div
        style={{ y }}
        className="relative z-10 mx-auto max-w-[90rem] px-5 lg:px-12"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-center gap-8 md:gap-12 lg:gap-16 w-full md:mb-20">
          <div className="shrink-0 md:ml-12 lg:ml-20">
            <h2 className="font-serif text-[clamp(3.5rem,6vw,6rem)] font-normal leading-[0.9] tracking-tight text-[#1A1A1A] flex flex-col items-start">
              <span className="z-10 relative">Sản vật</span>
              <span className={`${scriptFont.className} block text-primary text-[1.25em] leading-[0.8] ml-[1.6em] mt-2 -rotate-2 z-0 drop-shadow-sm whitespace-nowrap`}>Tinh hoa</span>
            </h2>
          </div>
          <div className="hidden md:block h-24 w-px bg-[#1A1A1A]/10 shrink-0" />
          <div className="flex-1 flex flex-col items-start gap-6">
            <p className="text-xl font-light text-[#1A1A1A]/70 leading-relaxed max-w-lg">
              Những món quà mộc mạc từ đất mẹ, mang trọn vẹn hương vị phù sa và sự cần mẫn của người dân miền Tây.
            </p>
            <button className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-[#1A1A1A] text-white px-7 py-3.5 transition-all hover:bg-primary">
              <span className="font-medium uppercase tracking-widest text-xs">Xem toàn bộ</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="group flex flex-col border-l border-[#1A1A1A]/15 pl-6"
            >
              {/* Khung tranh (Passepartout effect) */}
              <div className="relative mb-6 aspect-[3/4] w-full border border-[#1A1A1A]/10 bg-[#F9F8F6] p-2.5 transition-colors duration-500 group-hover:border-[#1A1A1A]/30 group-hover:bg-white">
                <div className="relative h-full w-full overflow-hidden bg-[#D9D7D2]">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-serif text-2xl font-medium leading-tight text-[#1A1A1A] line-clamp-2">
                    {product.title}
                  </h3>
                  <span className="font-sans text-sm font-semibold tracking-wider text-primary whitespace-nowrap">
                    {product.price}
                  </span>
                </div>
                
                <p className="mt-4 text-sm font-light leading-relaxed text-[#1A1A1A]/60 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-8 flex">
                  <button onClick={() => handleAddToCart(product)} className="group/btn flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#1A1A1A] transition-colors hover:text-primary">
                    <span className="border-b border-transparent transition-colors group-hover/btn:border-primary">Thêm vào giỏ</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
