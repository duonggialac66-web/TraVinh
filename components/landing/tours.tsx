"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Tour } from "@/lib/default-content"
import { Clock, Banknote, ArrowRight, X, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { bookTour } from "@/app/actions/order"
import { Great_Vibes } from "next/font/google"

const scriptFont = Great_Vibes({ 
  subsets: ["vietnamese", "latin"], 
  weight: ["400"] 
})

export function Tours({ tours, title, subtitle }: { tours: Tour[], title?: React.ReactNode, subtitle?: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const yTitle = useTransform(scrollYProgress, [0, 1], [50, -50])
  const router = useRouter();

  const [bookingTour, setBookingTour] = useState<Tour | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!bookingTour) return;

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await bookTour(formData, bookingTour.id, bookingTour.title, bookingTour.price);
    
    if (res?.error === "UNAUTHORIZED") {
      router.push("/admin/login");
    } else if (res?.success) {
      setIsSuccess(true);
      setBookingTour(null);
    } else {
      setError(res?.error || "Có lỗi xảy ra, vui lòng thử lại sau.");
    }
    setLoading(false);
  }

  if (!tours || tours.length === 0) return null

  return (
    <section id="tours" ref={containerRef} className="relative w-full overflow-hidden bg-[#F9F8F6] py-20 sm:py-28 text-[#1A1A1A]">
      {/* Modal Đặt Tour */}
      <AnimatePresence>
        {bookingTour && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingTour(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h3 className="font-serif text-2xl font-medium">Đặt Tour Du Lịch</h3>
                <button onClick={() => setBookingTour(null)} className="rounded-full p-2 hover:bg-gray-200 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto">
                {/* Cột trái: Thông tin Tour */}
                <div className="bg-[#F9F8F6] p-6 md:w-2/5 flex flex-col justify-between border-r border-gray-100">
                  <div>
                    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl shadow-sm">
                      <Image src={bookingTour.image} alt={bookingTour.title} fill className="object-cover" />
                    </div>
                    <h4 className="font-serif text-xl font-medium leading-snug text-gray-900">{bookingTour.title}</h4>
                    
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Đơn giá (1 khách):</span>
                        <span className="font-medium text-gray-900">{bookingTour.price}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span>Thời lượng:</span>
                        <span className="font-medium text-gray-900">{bookingTour.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-primary/10 p-4">
                    <p className="text-xs text-primary/80 uppercase font-semibold tracking-wider mb-1">Tổng chi phí dự kiến</p>
                    <p className="text-2xl font-semibold text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        (parseInt(bookingTour.price.replace(/\D/g, "")) || 0) * participants
                      )}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">*Chưa bao gồm VAT và phụ phí ngày lễ</p>
                  </div>
                </div>

                {/* Cột phải: Form đặt chỗ */}
                <div className="p-6 md:w-3/5">
                  {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}

                  <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Người đại diện (Họ và tên) *</label>
                        <input type="text" name="customerName" required placeholder="VD: Nguyễn Văn A" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại liên hệ *</label>
                        <input type="tel" name="customerPhone" required placeholder="090..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Ngày khởi hành dự kiến *</label>
                        <input type="date" name="tourDate" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Số người tham gia *</label>
                        <input type="number" name="participants" required min="1" max="50" value={participants} onChange={(e) => setParticipants(parseInt(e.target.value) || 1)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Loại khách</label>
                        <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white">
                          <option>Khách lẻ / Gia đình</option>
                          <option>Khách đoàn (Công ty)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Yêu cầu đặc biệt</label>
                      <textarea name="customerNote" rows={2} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ví dụ: Đón tại sân bay, có người lớn tuổi, ăn chay..." />
                    </div>
                    
                    <label className="flex items-start gap-2 mt-2 cursor-pointer group">
                      <input type="checkbox" required className="mt-1 rounded text-primary focus:ring-primary" />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Tôi đã đọc và đồng ý với các <a href="#" className="text-primary hover:underline">Chính sách đặt/hủy tour</a> và quy định của công ty.</span>
                    </label>

                    <button type="submit" disabled={loading} className="mt-2 rounded-xl bg-primary py-3.5 font-medium text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 disabled:opacity-50 transition-all active:scale-[0.98]">
                      {loading ? "Đang xử lý đặt chỗ..." : "Gửi Yêu Cầu Đặt Tour"}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccess(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-serif text-3xl font-medium text-gray-900 mb-2">Thành công!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Yêu cầu đặt tour của bạn đã được gửi thành công. Nhân viên tư vấn của chúng tôi sẽ liên hệ trong thời gian sớm nhất để xác nhận lịch trình! 
                Vui lòng chú ý điện thoại để nhận thông tin.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="w-full rounded-xl bg-primary py-3.5 font-medium text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Đóng thông báo
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Texture overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('/images/paper-texture.png')" }} />
      
      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div style={{ y: yTitle }} className="mb-20 md:mb-28 flex flex-col md:flex-row md:items-center gap-8 md:gap-12 lg:gap-16 w-full">
          <div className="shrink-0">
            <h2 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-tighter flex flex-col items-start">
              {title || (
                <>
                  <span className="z-10 relative">Hành trình</span>
                  <span className={`${scriptFont.className} block text-primary text-[1.25em] leading-[0.8] ml-[2em] mt-2 -rotate-2 z-0 drop-shadow-sm whitespace-nowrap`}>Khám phá</span>
                </>
              )}
            </h2>
          </div>
          <div className="hidden md:block h-28 w-px bg-primary/20 shrink-0" />
          <div className="flex-1">
            <p className="text-xl font-light leading-relaxed text-[#1A1A1A]/70 max-w-lg">
              {subtitle || "Trải nghiệm chân thực nhịp sống, văn hóa và thiên nhiên mộc mạc của vùng đất trù phú miền Tây. Một góc nhìn khác biệt, sâu sắc và trọn vẹn."}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-20 md:gap-32">
          {tours.map((tour, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={tour.id} className={`group flex flex-col gap-12 md:items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                
                {/* Image Section - takes up 60% on desktop */}
                <div className="relative w-full md:w-3/5">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-[16/10]">
                    <Image
                      src={tour.image || "/placeholder.svg"}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-transparent" />
                  </div>
                  
                  {/* Floating badge */}
                  <div className={`absolute bottom-8 ${isEven ? "-right-8" : "-left-8"} hidden rounded-full bg-primary px-6 py-4 text-primary-foreground shadow-2xl backdrop-blur-md md:block`}>
                    <div className="flex items-center gap-2 font-serif text-xl">
                      <Banknote className="h-5 w-5" />
                      {tour.price}
                    </div>
                  </div>
                </div>

                {/* Text Section - takes up 40% on desktop */}
                <div className="flex w-full flex-col md:w-2/5 md:px-8">
                  <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-primary font-medium">
                    <Clock className="h-4 w-4" />
                    {tour.duration}
                  </div>
                  
                  <h3 className="mt-6 font-serif text-4xl font-medium leading-tight sm:text-5xl">
                    {tour.title}
                  </h3>
                  
                  <p className="mt-6 text-lg font-light leading-relaxed text-[#1A1A1A]/70">
                    {tour.description}
                  </p>

                  <div className="mt-12 flex items-center gap-4">
                    <button 
                      onClick={() => setBookingTour(tour)}
                      className="group/btn flex items-center gap-4 overflow-hidden rounded-full border border-[#1A1A1A]/20 px-8 py-4 transition-colors hover:bg-[#1A1A1A] hover:text-white"
                    >
                      <span className="font-medium uppercase tracking-wider text-sm">Đặt chỗ ngay</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-2" />
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
