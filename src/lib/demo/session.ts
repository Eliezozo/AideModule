// src/lib/demo/session.ts
import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";
import { getStore } from "@/lib/demo/store";
import type { DemoSession, DemoUser } from "@/lib/demo/types";

export async function getDemoSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export async function setDemoSession(session: DemoSession) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

export async function requireUser(): Promise<DemoUser> {
  const session = await getDemoSession();
  if (!session) {
    throw new Error("NON_AUTHENTICATED");
  }

  const user = getStore().users.find((u) => u.id === session.userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}

export async function requireAdmin(): Promise<DemoUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
