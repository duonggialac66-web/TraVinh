"use client"

import { useState } from "react"
import { SiteContentPanel } from "./site-content-panel"
import { CollectionPanel, type CollectionField } from "./collection-panel"
import {
  saveLocationAction,
  removeLocationAction,
  saveFestivalAction,
  removeFestivalAction,
  saveFoodAction,
  removeFoodAction,
  saveGalleryAction,
  removeGalleryAction,
  saveTourAction,
  removeTourAction,
  saveProductAction,
  removeProductAction,
} from "@/app/admin/actions"
import type { LandingData } from "@/lib/content"
import { ShoppingCart, MapPin, Tent, Utensils, Compass, Package, Settings, ChevronRight, Image as ImageIcon, Users } from "lucide-react"

const tabs = [
  { id: "orders", label: "Quản lý đơn hàng", icon: ShoppingCart, desc: "Đơn mua hàng & Đặt tour" },
  { id: "users", label: "Người dùng", icon: Users, desc: "Tài khoản thành viên" },
  { id: "locations", label: "Địa điểm", icon: MapPin, desc: "Danh thắng Trà Vinh" },
  { id: "festivals", label: "Văn hóa", icon: Tent, desc: "Bài viết văn hóa, lễ hội" },
  { id: "foods", label: "Ẩm thực", icon: Utensils, desc: "Các món ngon đặc sản" },
  { id: "tours", label: "Tour du lịch", icon: Compass, desc: "Lịch trình trải nghiệm" },
  { id: "products", label: "Sản phẩm", icon: Package, desc: "Đặc sản làm quà (Shop)" },
  { id: "gallery", label: "Thư viện ảnh", icon: ImageIcon, desc: "Hình ảnh trưng bày" },
  { id: "content", label: "Cấu hình chung", icon: Settings, desc: "Cài đặt thông tin website" },
] as const

const placeFields: CollectionField[] = [
  { name: "title", label: "Tên" },
  { name: "description", label: "Mô tả ngắn", type: "textarea" },
  { name: "content", label: "Nội dung bài viết chuẩn SEO", type: "richtext" },
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "tag", label: "Nhãn (tag)" },
  { name: "order", label: "Thứ tự", type: "number" },
  { name: "mapTop", label: "Ghim định vị trên bản đồ", type: "map_picker" },
  { name: "floatingImage1", label: "Ảnh bay 1 (tùy chọn)", type: "image" },
  { name: "floatingImage2", label: "Ảnh bay 2 (tùy chọn)", type: "image" },
  { name: "floatingImage3", label: "Ảnh bay 3 (tùy chọn)", type: "image" },
]

const festivalFields: CollectionField[] = [
  { name: "title", label: "Tên" },
  { name: "description", label: "Mô tả", type: "textarea" },
  { name: "content", label: "Nội dung bài viết chuẩn SEO", type: "richtext" },
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "season", label: "Mùa / thời điểm" },
  { name: "order", label: "Thứ tự", type: "number" },
]

const foodFields: CollectionField[] = [
  { name: "title", label: "Tên món" },
  { name: "description", label: "Mô tả", type: "textarea" },
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "order", label: "Thứ tự", type: "number" },
]

const galleryFields: CollectionField[] = [
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "caption", label: "Chú thích" },
  { name: "order", label: "Thứ tự", type: "number" },
]

const tourFields: CollectionField[] = [
  { name: "title", label: "Tên Tour" },
  { name: "description", label: "Mô tả lộ trình", type: "textarea" },
  { name: "price", label: "Mức giá" },
  { name: "duration", label: "Thời gian" },
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "order", label: "Thứ tự", type: "number" },
]

const productFields: CollectionField[] = [
  { name: "title", label: "Tên sản phẩm" },
  { name: "description", label: "Mô tả", type: "textarea" },
  { name: "price", label: "Giá bán" },
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "order", label: "Thứ tự", type: "number" },
]

export function AdminTabs({ data, orders = [], users = [] }: { data: LandingData, orders?: any[], users?: any[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("orders")

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky top-10 flex flex-col gap-2">
          <h2 className="mb-4 font-serif text-xl font-medium px-4 text-[#1A1A1A]">Bảng điều khiển</h2>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all duration-300 ${isActive
                    ? "bg-white shadow-md shadow-black/[0.03] border border-[#1A1A1A]/10"
                    : "border border-transparent hover:bg-white/60 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-primary text-white" : "bg-[#1A1A1A]/5 text-[#1A1A1A]/50 group-hover:bg-[#1A1A1A]/10 group-hover:text-[#1A1A1A]"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold tracking-wide ${isActive ? "text-[#1A1A1A]" : ""}`}>{t.label}</div>
                    <div className={`text-[11px] mt-0.5 font-medium ${isActive ? "text-primary" : "text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]/60"}`}>{t.desc}</div>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? "translate-x-1 opacity-100 text-primary" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        {active === "content" ? (
          <div className="rounded-3xl border border-[#1A1A1A]/5 bg-white p-6 sm:p-10 shadow-xl shadow-black/[0.02]">
            <h2 className="mb-8 font-serif text-3xl font-medium">Cấu hình chung website</h2>
            <SiteContentPanel content={data.content} />
          </div>
        ) : null}

        {active === "orders" ? (
          <div className="rounded-3xl border border-[#1A1A1A]/5 bg-white p-6 sm:p-10 shadow-xl shadow-black/[0.02]">
            <h2 className="mb-2 font-serif text-3xl font-medium text-[#1A1A1A]">Đơn hàng & Đặt Tour</h2>
            <p className="mb-8 text-sm text-[#1A1A1A]/50 font-medium tracking-wide">Quản lý và theo dõi trạng thái các yêu cầu từ khách hàng.</p>

            {orders.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-[#1A1A1A]/10 bg-[#F9F8F6] text-gray-500">
                <ShoppingCart className="mb-3 h-10 w-10 opacity-20" />
                <p className="font-medium">Chưa có đơn hàng nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#1A1A1A]/5">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#F9F8F6] text-[#1A1A1A]/60 uppercase tracking-widest text-xs font-semibold">
                    <tr>
                      <th className="py-4 px-5">Mã ĐH</th>
                      <th className="py-4 px-5">Khách hàng</th>
                      <th className="py-4 px-5">Loại</th>
                      <th className="py-4 px-5">Chi tiết</th>
                      <th className="py-4 px-5">Tổng tiền</th>
                      <th className="py-4 px-5">Ngày đặt</th>
                      <th className="py-4 px-5">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5 bg-white">
                    {orders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-[#F9F8F6]/50">
                        <td className="py-4 px-5 text-xs font-mono font-medium text-[#1A1A1A]/70">{order.id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-[#1A1A1A]">{order.user?.name || "Khách"}</div>
                          <div className="text-xs text-[#1A1A1A]/50 mt-0.5">{order.user?.email || ""}</div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${order._type === 'TOUR' ? 'bg-primary/10 text-primary' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
                            {order._type}
                          </span>
                        </td>
                        <td className="py-4 px-5 max-w-[200px] whitespace-normal">
                          {order._type === 'TOUR' ? (
                            <div>
                              <div className="font-medium text-[#1A1A1A] line-clamp-1" title={order.tourName}>{order.tourName}</div>
                              <div className="text-xs text-primary font-semibold mt-1">
                                Đi ngày: {order.tourDate} • {order.participants} người
                              </div>
                            </div>
                          ) : (
                            <ul className="list-inside list-disc text-xs text-[#1A1A1A]/70 font-medium line-clamp-2">
                              {order.items?.map((item: any) => (
                                <li key={item.id} className="truncate" title={item.productName}>
                                  {item.productName} (x{item.quantity})
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="py-4 px-5 font-semibold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        </td>
                        <td className="py-4 px-5 text-xs font-medium text-[#1A1A1A]/50">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4 px-5">
                          <select
                            className="rounded-xl border border-[#1A1A1A]/10 bg-[#F9F8F6] px-3 py-2 text-xs font-semibold outline-none transition-colors hover:border-[#1A1A1A]/30 focus:border-primary"
                            defaultValue={order.status}
                          >
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {active === "users" ? (
          <div className="rounded-3xl border border-[#1A1A1A]/5 bg-white p-6 sm:p-10 shadow-xl shadow-black/[0.02]">
            <h2 className="mb-2 font-serif text-3xl font-medium text-[#1A1A1A]">Quản lý Người dùng</h2>
            <p className="mb-8 text-sm text-[#1A1A1A]/50 font-medium tracking-wide">Tất cả tài khoản thành viên đã đăng nhập vào hệ thống.</p>

            {users.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-[#1A1A1A]/10 bg-[#F9F8F6] text-gray-500">
                <Users className="mb-3 h-10 w-10 opacity-20" />
                <p className="font-medium">Chưa có người dùng nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#1A1A1A]/5">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#F9F8F6] text-[#1A1A1A]/60 uppercase tracking-widest text-xs font-semibold">
                    <tr>
                      <th className="py-4 px-5">KHÁCH HÀNG</th>
                      <th className="py-4 px-5">EMAIL</th>
                      <th className="py-4 px-5">QUYỀN HẠN</th>
                      <th className="py-4 px-5">NGÀY THAM GIA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5 bg-white">
                    {users.map((u) => (
                      <tr key={u.id} className="transition-colors hover:bg-[#F9F8F6]/50">
                        <td className="py-4 px-5 flex items-center gap-3">
                          <img src={u.image || "/logo.png"} alt="" className="w-8 h-8 rounded-full border border-[#1A1A1A]/10" />
                          <span className="font-semibold text-[#1A1A1A]">{u.name}</span>
                        </td>
                        <td className="py-4 px-5 font-medium text-[#1A1A1A]/70">{u.email}</td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
                            {u.role || 'USER'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-xs font-medium text-[#1A1A1A]/50">
                          {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {active === "locations" ? (
          <CollectionPanel
            items={data.locations}
            fields={placeFields}
            saveAction={saveLocationAction}
            deleteAction={removeLocationAction}
            labelSingular="địa điểm"
            mapImage={data.content.locationMapImage}
          />
        ) : null}
        {active === "festivals" ? (
          <CollectionPanel
            items={data.festivals}
            fields={festivalFields}
            saveAction={saveFestivalAction}
            deleteAction={removeFestivalAction}
            labelSingular="bài viết văn hóa"
          />
        ) : null}
        {active === "foods" ? (
          <CollectionPanel
            items={data.foods}
            fields={foodFields}
            saveAction={saveFoodAction}
            deleteAction={removeFoodAction}
            labelSingular="món ăn"
          />
        ) : null}
        {active === "gallery" ? (
          <CollectionPanel
            items={data.gallery}
            fields={galleryFields}
            saveAction={saveGalleryAction}
            deleteAction={removeGalleryAction}
            labelSingular="hình ảnh"
          />
        ) : null}
        {active === "tours" ? (
          <CollectionPanel
            items={data.tours}
            fields={tourFields}
            saveAction={saveTourAction}
            deleteAction={removeTourAction}
            labelSingular="tour du lịch"
          />
        ) : null}
        {active === "products" ? (
          <CollectionPanel
            items={data.products}
            fields={productFields}
            saveAction={saveProductAction}
            deleteAction={removeProductAction}
            labelSingular="sản phẩm"
          />
        ) : null}
      </div>
    </div>
  )
}
