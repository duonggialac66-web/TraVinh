"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import type { Product } from "@/lib/default-content"
import { ArrowUpRight, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart"

export function Products({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const { addItem, setIsOpen, items } = useCartStore()

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
        <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end md:mb-20">
          <div className="max-w-3xl">
            <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[0.9] tracking-tight text-[#1A1A1A]">
              Sản vật <br/><span className="text-primary italic">Tinh hoa</span>
            </h2>
            <p className="mt-6 text-xl font-light text-[#1A1A1A]/70 max-w-xl leading-relaxed">
              Những món quà mộc mạc từ đất mẹ, mang trọn vẹn hương vị phù sa và sự cần mẫn của người dân miền Tây.
            </p>
          </div>
          <button className="group relative flex items-center gap-4 overflow-hidden rounded-full border border-[#1A1A1A]/20 px-8 py-4 transition-all hover:bg-[#1A1A1A] hover:text-white">
            <span className="font-medium uppercase tracking-widest text-xs">Xem toàn bộ</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="group flex flex-col"
            >
              <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden bg-[#D9D7D2]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
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
