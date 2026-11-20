// src/features/tutors/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  BusinessError,
  requestTutorAccess,
  setTutorStatus,
} from "@/lib/demo/business";
import { requireAdmin, requireUser } from "@/lib/demo/session";

export type ActionState = { error?: string; success?: string };

export async function applyTutorAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireUser();
    requestTutorAccess(user, {
      bio: String(formData.get("bio") || ""),
      payoutPhone: String(formData.get("payoutPhone") || ""),
      payoutProvider: String(formData.get("payoutProvider") || "TMONEY"),
    });
    revalidatePath("/tutor/dashboard");
    revalidatePath("/tutor/settings");
    revalidatePath("/admin/tutors");
    return { success: "Demande envoyée. En attente de validation admin." };
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    throw error;
  }
}

export async function approveTutorAction(tutorId: string) {
  await requireAdmin();
  setTutorStatus(tutorId, "approved");
  revalidatePath("/admin/tutors");
}

export async function rejectTutorAction(tutorId: string) {
  await requireAdmin();
  setTutorStatus(tutorId, "rejected");
  revalidatePath("/admin/tutors");
}

export async function suspendTutorAction(tutorId: string) {
  await requireAdmin();
  setTutorStatus(tutorId, "suspended");
  revalidatePath("/admin/tutors");
}
