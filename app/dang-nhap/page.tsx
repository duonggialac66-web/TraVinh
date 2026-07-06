"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Đăng nhập
        const res = await signIn("credentials", {
          ...data,
          redirect: false,
        })
        
        if (res?.error) {
          setError(res.error)
        } else {
          window.location.href = "/"
        }
      } else {
        // Đăng ký
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!res.ok) {
          const text = await res.text()
          setError(text)
        } else {
          // Tự động đăng nhập sau khi đăng ký
          await signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: "/",
          })
        }
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center flex flex-col relative"
      style={{ backgroundImage: "url('/images/hero-tra-vinh.png')" }}
    >
      {/* Lớp mờ màu đen để làm nổi bật form và Navbar */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 rounded-3xl bg-background/95 p-10 backdrop-blur-xl border border-border shadow-2xl">
            <div className="text-center">
            <h2 className="mt-2 text-3xl font-serif font-bold tracking-tight text-foreground">
              {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin ? "Sử dụng tài khoản của bạn để tiếp tục" : "Đăng ký để khám phá Trà Vinh"}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="mt-1 block w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Nhập họ và tên..."
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="mt-1 block w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nhập email của bạn..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Mật khẩu</label>
              <input
                type="password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="mt-1 block w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nhập mật khẩu..."
              />
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký")}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-secondary px-2 text-muted-foreground rounded-full">
                Hoặc
              </span>
            </div>
          </div>
          
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="group relative flex w-full justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            </span>
            Tiếp tục với Google
          </button>

          <p className="text-center text-sm text-foreground font-medium">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
      <Footer />
    </main>
  )
}
