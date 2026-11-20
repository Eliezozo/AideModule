// src/features/catalog/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  BusinessError,
  createModule,
  toggleModuleActive,
} from "@/lib/demo/business";
import { requireAdmin } from "@/lib/demo/session";
import { getStore, uid } from "@/lib/demo/store";

export type ActionState = { error?: string; success?: string };

export async function createModuleAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    createModule({
      facultyId: String(formData.get("facultyId")),
      levelId: String(formData.get("levelId")),
      name: String(formData.get("name") || ""),
      code: String(formData.get("code") || "") || null,
      description: String(formData.get("description") || "") || null,
    });
    revalidatePath("/admin/modules");
    revalidatePath("/student/requests/new");
    return { success: "Module ajouté au catalogue." };
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    throw error;
  }
}

export async function toggleModuleAction(moduleId: string) {
  await requireAdmin();
  toggleModuleActive(moduleId);
  revalidatePath("/admin/modules");
}

export async function createFacultyAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
    const name = String(formData.get("name") || "").trim();
    const code = String(formData.get("code") || "").trim().toUpperCase();
    if (!name || !code) return { error: "Nom et code requis." };

    const store = getStore();
    if (store.faculties.some((f) => f.code === code)) {
      return { error: "Ce code de filière existe déjà." };
    }

    store.faculties.push({
      id: uid("fac"),
      name,
      code,
      isActive: true,
    });
    revalidatePath("/admin/modules");
    return { success: "Filière créée." };
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    throw error;
  }
}

export async function prepareWithdrawalsAction() {
  await requireAdmin();
  const { prepareWeeklyWithdrawals } = await import("@/lib/demo/business");
  const ids = prepareWeeklyWithdrawals();
  revalidatePath("/admin/withdrawals");
  revalidatePath("/admin/finance");
  revalidatePath("/tutor/earnings");
  return { success: `${ids.length} reversement(s) préparé(s).` };
}
