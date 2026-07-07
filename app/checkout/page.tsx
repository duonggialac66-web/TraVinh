"use client"

import { useCartStore } from "@/store/cart"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { checkoutCart } from "@/app/actions/order"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function CheckoutPage() {
  const { carts, activeUser, clearCart } = useCartStore()
  const items = carts[activeUser] || []
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (items.length === 0) {
      router.push("/")
    }
  }, [items, router])

  if (!mounted || items.length === 0) return null

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await checkoutCart(formData, items, totalAmount)

    if (result.error === "UNAUTHORIZED") {
      router.push("/login")
    } else if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      // Không clearCart ngay để giữ giao diện nền và tránh bị auto redirect
    }
  }



  return (
    <div className="min-h-screen bg-[#F9F8F6] pb-24 pt-12">
      <div className="mx-auto max-w-5xl px-5">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>

        <h1 className="mb-12 font-serif text-4xl font-semibold text-gray-900">Thanh toán</h1>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Thông tin giao hàng */}
          <div>
            <h2 className="mb-6 font-serif text-2xl font-medium">Thông tin nhận hàng</h2>
            
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Họ và tên người nhận</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="0912345678"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Địa chỉ & Ghi chú thêm</label>
                <textarea
                  name="customerNote"
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Ghi chú địa chỉ giao hàng, thời gian nhận hàng..."
                />
              </div>
            </form>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div>
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="mb-6 font-serif text-2xl font-medium">Đơn hàng của bạn</h2>
              
              <div className="flex max-h-[400px] flex-col gap-6 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-xl font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-primary py-4 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cảm ơn */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md scale-100 transform opacity-100 rounded-3xl bg-white p-8 shadow-2xl text-center transition-all">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mb-4 font-serif text-3xl font-semibold">Đặt hàng thành công!</h2>
            <p className="mb-8 text-gray-500">Cảm ơn bạn đã ủng hộ đặc sản Trà Vinh. Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn.</p>
            <button 
              onClick={() => {
                clearCart()
                router.push("/")
              }} 
              className="rounded-xl bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary/90"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
