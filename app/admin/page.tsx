import Link from "next/link"
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { getLandingData } from "@/lib/content"
import { logoutAction } from "./actions"
import { AdminTabsWrapper } from "@/components/admin/admin-tabs-wrapper"

import { prisma } from "@/lib/prisma"

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login")
  }

  const data = await getLandingData()
  let orders: any[] = []
  try {
    const productOrders = await prisma.productOrder.findMany({
      include: { user: true, items: true },
    })
    const tourBookings = await prisma.tourBooking.findMany({
      include: { user: true },
    })
    orders = [
      ...productOrders.map(o => ({ ...o, _type: 'PRODUCT' })),
      ...tourBookings.map(o => ({ ...o, _type: 'TOUR' }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch(e) {
    console.error(e);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Bảng quản trị
          </span>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-foreground">
            Nội dung trang Trà Vinh
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent"
          >
            Xem trang landing
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              suppressHydrationWarning
              className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </header>

      {data.usingFallback ? (
        <div className="mt-6 rounded-3xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm leading-relaxed text-foreground">
          <strong className="font-semibold">Chưa kết nối cơ sở dữ liệu.</strong> Bạn đang xem dữ
          liệu mẫu — mọi chỉnh sửa sẽ chưa được lưu lại. Hãy thêm biến{" "}
          <code className="rounded bg-muted px-1">DATABASE_URL</code> của Neon, rồi chạy{" "}
          <code className="rounded bg-muted px-1">pnpm db:push</code> và{" "}
          <code className="rounded bg-muted px-1">pnpm db:seed</code> để bật tính năng lưu.
        </div>
      ) : null}

      <div className="mt-8">
        <AdminTabsWrapper data={data} orders={orders} />
      </div>
    </div>
  )
}
