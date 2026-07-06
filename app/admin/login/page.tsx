import Link from "next/link"
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { LoginForm } from "./login-form"

export const metadata = {
  title: "Đăng nhập quản trị · Trà Vinh",
}

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      {/* paper grain removed */}
      <div
        className="animate-blob pointer-events-none absolute -right-24 -top-24 size-80 bg-secondary/60 blur-2xl"
        aria-hidden
      />
      <div
        className="animate-floaty pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-accent/10 blur-2xl"
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-[2rem] border border-border bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur sm:p-10">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Về trang chủ
        </Link>
        <div className="mt-6">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Khu vực quản trị
          </span>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-none text-foreground">
            Trà Vinh
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Đăng nhập để tùy chỉnh toàn bộ nội dung trang giới thiệu.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-6 rounded-2xl bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Tài khoản mặc định: <span className="font-medium text-foreground">admin@travinh.travel</span>{" "}
          / <span className="font-medium text-foreground">travinh2024</span>. Đổi lại bằng biến môi
          trường <code>ADMIN_USERNAME</code> và <code>ADMIN_PASSWORD</code> trong file .env.
        </p>
      </div>
    </main>
  )
}
