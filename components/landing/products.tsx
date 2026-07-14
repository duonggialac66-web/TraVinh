"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/lib/default-content"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Great_Vibes } from "next/font/google"

const scriptFont = Great_Vibes({ 
  subsets: ["vietnamese", "latin"], 
  weight: ["400"] 
})

const ITEMS_PER_PAGE = 5

export function Products({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const { addItem } = useCartStore()
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length
  const remaining = products.length - visibleCount

  function handleAddToCart(product: Product) {
    const numericPrice = parseInt(product.price.replace(/\D/g, "")) || 0
    addItem({
      id: product.id,
      title: product.title,
      price: numericPrice,
      image: product.image
    })
  }

  function loadMore() {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, products.length))
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
            <div className="flex items-center gap-3 text-sm text-[#1A1A1A]/40 font-medium tracking-wide">
              <span className="h-px w-8 bg-[#1A1A1A]/20" />
              Đang hiển thị {visibleProducts.length} / {products.length} sản phẩm
            </div>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index < ITEMS_PER_PAGE ? index * 0.1 : (index % ITEMS_PER_PAGE) * 0.1, ease: [0.25, 1, 0.5, 1] }}
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      loading="lazy"
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
          </AnimatePresence>
        </div>

        {/* Nút Xem thêm */}
        {hasMore && (
          <motion.div 
            className="mt-16 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-[#1A1A1A]/15 to-transparent" />
            <button
              onClick={loadMore}
              className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-[#1A1A1A]/15 bg-white/80 backdrop-blur-sm px-8 py-4 transition-all duration-500 hover:border-primary/40 hover:bg-white hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-95"
            >
              <span className="font-medium text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/80 transition-colors group-hover:text-primary">
                Xem thêm {Math.min(ITEMS_PER_PAGE, remaining)} sản phẩm
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A]/5 transition-colors group-hover:bg-primary/10">
                <ChevronDown className="h-4 w-4 text-[#1A1A1A]/60 transition-all group-hover:text-primary group-hover:translate-y-0.5" />
              </span>
            </button>
            <span className="text-xs text-[#1A1A1A]/30 font-medium tracking-wide">
              Còn {remaining} sản phẩm chưa hiển thị
            </span>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
