import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "tra_vinh_user_session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return null;
  
  return { userId: session.value };
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 tuần
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// --- ADMIN AUTHENTICATION ---
const ADMIN_COOKIE_NAME = "admin_session";

export function verifyCredentials(email: string, pass: string) {
  // Demo purpose: basic auth via environment variable
  return pass === process.env.ADMIN_PASSWORD;
}

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has(ADMIN_COOKIE_NAME);
}
