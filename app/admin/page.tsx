import Link from "next/link"
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { getLandingData } from "@/lib/content"
import { logoutAction } from "./actions"
import { AdminTabsWrapper } from "@/components/admin/admin-tabs-wrapper"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function AdminData() {
  const data = await getLandingData()
  let orders: any[] = []
  let users: any[] = []

  try {
    const productOrders = await prisma.productOrder.findMany({
      include: { user: true, items: true },
    })
    const tourBookings = await prisma.tourBooking.findMany({
      include: { user: true },
    })
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })

    orders = [
      ...productOrders.map(o => ({ ...o, _type: 'PRODUCT' })),
      ...tourBookings.map(o => ({ ...o, _type: 'TOUR' }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    users = dbUsers;
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      {data.usingFallback ? (
        <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm leading-relaxed text-amber-800 shadow-sm">
          <strong className="font-semibold text-amber-900">Chưa kết nối cơ sở dữ liệu.</strong> Bạn đang xem dữ
          liệu mẫu — mọi chỉnh sửa sẽ chưa được lưu lại. Hãy thêm biến <code className="rounded bg-white px-1.5 py-0.5 font-mono shadow-sm">DATABASE_URL</code> của Neon.
        </div>
      ) : null}

      <AdminTabsWrapper data={data} orders={orders} users={users} />
    </>
  )
}

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-wrap items-center justify-between gap-4 px-5 py-8 md:px-10 lg:py-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-serif text-white shadow-lg shadow-primary/20">
              TV
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">
                Trang quản trị
              </span>
              <h1 className="mt-0.5 font-serif text-2xl font-medium text-[#1A1A1A]">
                Trà Vinh <span className="italic text-primary">Studio</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 bg-white px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]/30 hover:bg-gray-50"
            >
              Xem trang đích
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                suppressHydrationWarning
                className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-primary"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </header>

        <div className="px-5 pb-16 md:px-10">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium uppercase tracking-widest text-primary/80">
                Đang tải dữ liệu động...
              </p>
            </div>
          }>
            <AdminData />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
