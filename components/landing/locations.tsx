"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "motion/react"
import type { Location } from "@/lib/default-content"
import { ArrowUpRight } from "lucide-react"

export function Locations({ locations, mapImage }: { locations: Location[], mapImage?: string }) {
  const [hoveredLocId, setHoveredLocId] = useState<string | null>(null)

  const getFloatingImages = (loc: Location) => {
    const urls = [loc.image];
    if (loc.floatingImage1 && !urls.includes(loc.floatingImage1)) urls.push(loc.floatingImage1);
    if (loc.floatingImage2 && !urls.includes(loc.floatingImage2)) urls.push(loc.floatingImage2);
    if (loc.floatingImage3 && !urls.includes(loc.floatingImage3)) urls.push(loc.floatingImage3);

    const imgRegex = /<img[^>]+>/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(loc.content || "")) !== null && urls.length < 3) {
      const imgTag = imgMatch[0];
      const altMatch = imgTag.match(/alt="([^">]+)"/);
      const srcMatch = imgTag.match(/src="([^">]+)"/);
      
      let url = "";
      if (altMatch && altMatch[1].startsWith('http')) {
        url = altMatch[1]; // Use fullsize from alt if available
      } else if (srcMatch) {
        url = srcMatch[1];
      }

      if (url && !urls.includes(url)) {
        urls.push(url);
      }
    }
    return urls.slice(0, 3);
  };

  const activeLoc = locations.find(l => l.id === hoveredLocId);
  const transformOrigin = activeLoc && activeLoc.mapTop != null && activeLoc.mapLeft != null 
    ? `${activeLoc.mapLeft}% ${activeLoc.mapTop}%` 
    : "center";

  return (
    <section id="dia-diem" className="bg-[#111111] text-white px-5 py-24 sm:py-32 overflow-x-hidden">
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

        <div className="flex flex-col lg:flex-row w-full gap-6 lg:h-[75vh] lg:min-h-[600px] items-stretch">
          {/* Bản đồ hành chính */}
          {mapImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-2/5 flex justify-center items-center pointer-events-none relative min-h-[350px] lg:min-h-0 bg-transparent p-6"
            >
              <div className="relative w-full max-w-md">
                <img
                  src={mapImage}
                  alt="Bản đồ hành chính tỉnh Trà Vinh"
                  className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] mix-blend-screen opacity-90"
                />
                {/* Dynamic Map Markers */}
                {locations.map((loc) => {
                  if (loc.mapTop == null || loc.mapLeft == null) return null;
                  const isHovered = hoveredLocId === loc.id;
                  const floatingImages = getFloatingImages(loc);
                  
                  return (
                    <div 
                      key={`marker-${loc.id}`}
                      style={{ top: `${loc.mapTop}%`, left: `${loc.mapLeft}%` }}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-0 h-0"
                    >
                      {/* Cục phát sáng thay vì số */}
                      <div className={`w-3 h-3 rounded-full transition-all duration-500 absolute ${
                        isHovered 
                          ? "bg-[#10b981] scale-150 animate-pulse shadow-[0_0_20px_rgba(16,185,129,1)] z-30" 
                          : "bg-white/80 z-10"
                      }`} />

                      {/* Đường nối */}
                      {isHovered && (
                        <svg className="absolute top-0 left-0 w-0 h-0 overflow-visible pointer-events-none z-0">
                          {floatingImages.map((_, i) => {
                            const angle = (i - 1) * 60;
                            const distance = 120;
                            const x = Math.sin(angle * Math.PI / 180) * distance;
                            const y = -Math.cos(angle * Math.PI / 180) * distance - 20;
                            
                            return (
                              <motion.line
                                key={`line-${i}`}
                                x1={0} y1={0}
                                initial={{ x2: 0, y2: 0, opacity: 0 }}
                                animate={{ x2: x, y2: y, opacity: 1 }}
                                exit={{ x2: 0, y2: 0, opacity: 0 }}
                                transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 15 }}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                              />
                            )
                          })}
                        </svg>
                      )}

                      {/* Hình ảnh bay ra */}
                      {isHovered && floatingImages.map((imgUrl, i) => {
                        const angle = (i - 1) * 60; // -60, 0, 60 degrees
                        const distance = 120; // radius of flying out
                        const x = Math.sin(angle * Math.PI / 180) * distance;
                        const y = -Math.cos(angle * Math.PI / 180) * distance - 20;

                        return (
                          <div 
                            key={i} 
                            className="absolute pointer-events-none" 
                            style={{ transform: 'translate(-50%, -50%)', zIndex: 20 - i }}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                              animate={{ opacity: 1, x, y, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 15 }}
                              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-white/50 shadow-2xl flex-shrink-0"
                            >
                              <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                            </motion.div>
                          </div>
                        )
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className={`flex flex-col lg:flex-row w-full gap-4 h-full ${mapImage ? 'lg:w-3/5' : 'lg:w-full'}`}
          >
          {locations.map((loc, i) => (
            <motion.div
              key={loc.id}
              onMouseEnter={() => setHoveredLocId(loc.id)}
              onMouseLeave={() => setHoveredLocId(null)}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex-1 min-h-[350px] sm:min-h-[400px] lg:min-h-0 overflow-hidden rounded-[2rem] bg-zinc-900 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hover:flex-[4] lg:focus-within:flex-[4] origin-bottom perspective-[1000px]"
            >
              <Link href={`/dia-diem/${loc.id}`} className="absolute inset-0 block">
                <Image
                  src={loc.image || "/placeholder.svg"}
                  alt={loc.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover opacity-60 grayscale-[30%] transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />
                
                <div className="absolute inset-0 hidden flex-col items-center justify-end p-8 lg:flex lg:opacity-100 lg:group-hover:opacity-0 transition-opacity duration-500">
                  <h3 className="font-serif text-3xl font-medium tracking-wide text-white" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    {loc.title}
                  </h3>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 sm:p-8 lg:translate-y-8 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <div className="mb-6 w-fit rounded-full border border-white/20 bg-black/30 px-4 py-1.5 backdrop-blur-md">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                      {loc.tag}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-3xl font-medium text-white sm:text-4xl break-words">
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
        </motion.div>
        </div>
      </div>
    </section>
  )
}
