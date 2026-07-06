"use client";

import { useState } from "react";
import { loginOrRegister } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginOrRegister(formData, isLogin);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6] px-4 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-[#1A1A1A]/10 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center font-serif text-3xl font-semibold text-[#1A1A1A]">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h1>
        <p className="mb-8 text-center text-sm text-[#1A1A1A]/60">
          {isLogin
            ? "Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục."
            : "Tạo tài khoản để trải nghiệm tốt nhất."}
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">Họ và tên</label>
              <input
                type="text"
                name="name"
                required
                className="w-full rounded-xl border border-[#1A1A1A]/20 bg-transparent px-4 py-3 outline-none focus:border-primary"
                placeholder="Nhập họ tên"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-[#1A1A1A]/20 bg-transparent px-4 py-3 outline-none focus:border-primary"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1A1A1A]">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-[#1A1A1A]/20 bg-transparent px-4 py-3 outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#1A1A1A]/60">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
