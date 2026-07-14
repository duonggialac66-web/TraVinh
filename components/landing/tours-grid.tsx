"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { Tour } from "@/lib/default-content"
import { Clock, ArrowUpRight, X, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { bookTour } from "@/app/actions/order"

export function ToursGrid({ tours, title, subtitle }: { tours: Tour[], title?: React.ReactNode, subtitle?: React.ReactNode }) {
  const containerRef = useRef<HTMLElement>(null)
  const router = useRouter()

  const [bookingTour, setBookingTour] = useState<Tour | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [participants, setParticipants] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    <section id="tours-grid" ref={containerRef} className="relative w-full overflow-hidden bg-transparent py-8 sm:py-16">
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
                <h3 className="font-serif text-2xl font-medium text-gray-900">Đặt Tour Du Lịch</h3>
                <button onClick={() => setBookingTour(null)} className="rounded-full p-2 hover:bg-gray-200 transition-colors text-gray-900">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto text-gray-900">
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
                        <input type="text" name="customerName" required placeholder="VD: Nguyễn Văn A" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại liên hệ *</label>
                        <input type="tel" name="customerPhone" required placeholder="090..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Ngày khởi hành dự kiến *</label>
                        <input type="date" name="tourDate" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Số người tham gia *</label>
                        <input type="number" name="participants" required min="1" max="50" value={participants} onChange={(e) => setParticipants(parseInt(e.target.value) || 1)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Loại khách</label>
                        <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900">
                          <option>Khách lẻ / Gia đình</option>
                          <option>Khách đoàn (Công ty)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Yêu cầu đặc biệt</label>
                      <textarea name="customerNote" rows={2} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-900" placeholder="Ví dụ: Đón tại sân bay, có người lớn tuổi, ăn chay..." />
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
                Yêu cầu đặt tour của bạn đã được gửi thành công. Nhân viên tư vấn của chúng tôi sẽ liên hệ trong thời gian sớm nhất!
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

      <div className="relative z-10 mx-auto max-w-[90rem] px-5 lg:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-center gap-8 md:gap-12 lg:gap-16 w-full md:mb-16">
          <div className="shrink-0 md:ml-12 lg:ml-20">
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[0.9] tracking-tight text-[#1A1A1A] flex flex-col items-start">
              {title || "Hành trình"}
            </h2>
          </div>
          <div className="hidden md:block h-24 w-px bg-[#1A1A1A]/10 shrink-0" />
          <div className="flex-1 flex flex-col items-start gap-6">
            <p className="text-xl font-light text-[#1A1A1A]/70 leading-relaxed max-w-lg">
              {subtitle || "Trải nghiệm chân thực nhịp sống, văn hóa và thiên nhiên mộc mạc của vùng đất trù phú miền Tây."}
            </p>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
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
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-serif text-2xl font-medium leading-tight text-[#1A1A1A] line-clamp-2">
                    {tour.title}
                  </h3>
                  <span className="font-sans text-sm font-semibold tracking-wider text-primary whitespace-nowrap">
                    {tour.price}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-medium">
                  <Clock className="h-3 w-3" />
                  {tour.duration}
                </div>
                
                <p className="mt-4 text-sm font-light leading-relaxed text-[#1A1A1A]/60 line-clamp-3">
                  {tour.description}
                </p>

                <div className="mt-8 flex">
                  <button onClick={() => setBookingTour(tour)} className="group/btn flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#1A1A1A] transition-colors hover:text-primary">
                    <span className="border-b border-transparent transition-colors group-hover/btn:border-primary">Đặt chỗ ngay</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
