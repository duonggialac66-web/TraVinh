import type { ReactNode } from "react"

export const metadata = {
  title: "Quản trị nội dung · Trà Vinh",
}

// Route con /admin/login tự xử lý riêng; các trang admin khác được bảo vệ
// trong từng page bằng isAuthenticated(). Layout này chỉ bọc khung nền.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}
