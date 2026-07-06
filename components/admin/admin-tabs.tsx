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

const tabs = [
  { id: "content", label: "Nội dung chung" },
  { id: "orders", label: "Đơn hàng mới" },
  { id: "locations", label: "Địa điểm" },
  { id: "festivals", label: "Văn hóa & lễ hội" },
  { id: "foods", label: "Ẩm thực" },
  { id: "tours", label: "Tour du lịch" },
  { id: "products", label: "Đặc sản (Shop)" },
] as const

// ... (keep fields same)
const placeFields: CollectionField[] = [
  { name: "title", label: "Tên" },
  { name: "description", label: "Mô tả ngắn", type: "textarea" },
  { name: "content", label: "Nội dung bài viết chuẩn SEO", type: "richtext" },
  { name: "image", label: "Đường dẫn ảnh/video" },
  { name: "tag", label: "Nhãn (tag)" },
  { name: "order", label: "Thứ tự", type: "number" },
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

export function AdminTabs({ data, orders = [] }: { data: LandingData, orders?: any[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("content")

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {active === "content" ? <SiteContentPanel content={data.content} /> : null}
        
        {active === "orders" ? (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-2xl font-semibold">Quản lý Đơn hàng & Tour</h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">Chưa có đơn hàng nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="pb-3 pr-4 font-medium">Mã ĐH</th>
                      <th className="pb-3 pr-4 font-medium">Khách hàng</th>
                      <th className="pb-3 pr-4 font-medium">Loại</th>
                      <th className="pb-3 pr-4 font-medium">Chi tiết mặt hàng</th>
                      <th className="pb-3 pr-4 font-medium">Tổng tiền</th>
                      <th className="pb-3 pr-4 font-medium">Ngày đặt</th>
                      <th className="pb-3 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/50">
                        <td className="py-4 pr-4 text-xs font-mono">{order.id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 pr-4">
                          <div className="font-medium text-foreground">{order.user?.name || "Khách"}</div>
                          <div className="text-xs text-muted-foreground">{order.user?.email || ""}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${order._type === 'TOUR' ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'}`}>
                            {order._type}
                          </span>
                        </td>
                        <td className="py-4 pr-4 max-w-[250px]">
                          {order._type === 'TOUR' ? (
                            <div>
                              <div className="font-medium truncate" title={order.tourName}>{order.tourName}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Đi ngày: {order.tourDate} • {order.participants} người
                              </div>
                            </div>
                          ) : (
                            <ul className="list-disc pl-4 text-xs text-muted-foreground">
                              {order.items?.map((item: any) => (
                                <li key={item.id} className="truncate" title={item.productName}>
                                  {item.productName} (x{item.quantity})
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="py-4 pr-4 font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        </td>
                        <td className="py-4 pr-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4">
                          <select 
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none"
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

        {active === "locations" ? (
          <CollectionPanel
            items={data.locations}
            fields={placeFields}
            saveAction={saveLocationAction}
            deleteAction={removeLocationAction}
            labelSingular="địa điểm"
          />
        ) : null}
        {active === "festivals" ? (
          <CollectionPanel
            items={data.festivals}
            fields={festivalFields}
            saveAction={saveFestivalAction}
            deleteAction={removeFestivalAction}
            labelSingular="lễ hội"
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
            labelSingular="ảnh"
          />
        ) : null}
        {active === "tours" ? (
          <CollectionPanel
            items={data.tours}
            fields={tourFields}
            saveAction={saveTourAction}
            deleteAction={removeTourAction}
            labelSingular="tour"
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
