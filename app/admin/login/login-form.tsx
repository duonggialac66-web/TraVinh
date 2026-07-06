"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { loginAction } from "../actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null as { error?: string } | null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Tài khoản / Email
        </label>
        <input
          id="email"
          name="email"
          type="text"
          required
          autoComplete="username"
          defaultValue="admin@travinh.travel"
          className="rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      {state?.error ? (
        <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
