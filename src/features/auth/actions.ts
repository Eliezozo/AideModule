// src/features/auth/actions.ts
"use server";

import { redirect } from "next/navigation";
import { getStore, uid } from "@/lib/demo/store";
import {
  clearDemoSession,
  setDemoSession,
} from "@/lib/demo/session";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const user = getStore().users.find(
    (u) =>
      u.email.toLowerCase() === parsed.data.email.toLowerCase() &&
      u.password === parsed.data.password
  );

  if (!user) {
    return { error: "Email ou mot de passe incorrect." };
  }

  await setDemoSession({ userId: user.id, role: user.role });

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/student/dashboard");
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    password: formData.get("password"),
    studentNumber: formData.get("studentNumber") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const exists = getStore().users.some(
    (u) => u.email.toLowerCase() === parsed.data.email.toLowerCase()
  );
  if (exists) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const user = {
    id: uid("user"),
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    studentNumber: parsed.data.studentNumber || null,
    facultyId: null,
    levelId: null,
    accountStatus: "active" as const,
    role: "student" as const,
    password: parsed.data.password,
  };

  getStore().users.push(user);
  await setDemoSession({ userId: user.id, role: user.role });
  redirect("/student/dashboard");
}

export async function logoutAction() {
  await clearDemoSession();
  redirect("/login");
}

export async function quickLoginAction(email: string): Promise<void> {
  const user = getStore().users.find((u) => u.email === email);
  if (!user) {
    throw new Error("Compte démo introuvable.");
  }
  await setDemoSession({ userId: user.id, role: user.role });
  if (user.role === "admin") redirect("/admin/dashboard");
  redirect("/student/dashboard");
}
