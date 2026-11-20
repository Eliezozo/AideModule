// src/features/requests/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BusinessError,
  createHelpRequest,
  createOrUpdateProposal,
  respondToProposal,
} from "@/lib/demo/business";
import { requireUser } from "@/lib/demo/session";
import {
  createProposalSchema,
  createRequestSchema,
} from "@/lib/validations/request";

export type ActionState = { error?: string; success?: string };

export async function createRequestAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const parsed = createRequestSchema.safeParse({
      facultyId: formData.get("facultyId"),
      levelId: formData.get("levelId"),
      moduleId: formData.get("moduleId"),
      description: formData.get("description"),
      preferredMode: formData.get("preferredMode"),
      preferredDate: formData.get("preferredDate") || "",
      preferredDurationMinutes: formData.get("preferredDurationMinutes"),
      budgetAmount: formData.get("budgetAmount") || null,
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const preferredDate = parsed.data.preferredDate
      ? new Date(parsed.data.preferredDate).toISOString()
      : null;

    createHelpRequest({
      requesterId: user.id,
      facultyId: parsed.data.facultyId,
      levelId: parsed.data.levelId,
      moduleId: parsed.data.moduleId,
      description: parsed.data.description,
      preferredMode: parsed.data.preferredMode,
      preferredDate,
      preferredDurationMinutes: parsed.data.preferredDurationMinutes,
      budgetAmount: parsed.data.budgetAmount ?? null,
    });

    revalidatePath("/student/requests");
    revalidatePath("/tutor/requests");
    redirect("/student/requests");
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    if (error instanceof Error && error.message === "NON_AUTHENTICATED") {
      redirect("/login");
    }
    throw error;
  }
}

export async function createProposalAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireUser();
    const parsed = createProposalSchema.safeParse({
      requestId: formData.get("requestId"),
      proposedMode: formData.get("proposedMode"),
      hourlyRate: formData.get("hourlyRate"),
      durationMinutes: formData.get("durationMinutes"),
      proposedDate: formData.get("proposedDate") || "",
      message: formData.get("message") || "",
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    createOrUpdateProposal({
      tutorUserId: user.id,
      requestId: parsed.data.requestId,
      proposedMode: parsed.data.proposedMode,
      hourlyRate: parsed.data.hourlyRate,
      durationMinutes: parsed.data.durationMinutes,
      proposedDate: parsed.data.proposedDate
        ? new Date(parsed.data.proposedDate).toISOString()
        : null,
      message: parsed.data.message || null,
    });

    revalidatePath("/tutor/proposals");
    revalidatePath("/student/proposals");
    return { success: "Proposition envoyée." };
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    throw error;
  }
}

export async function acceptProposalAction(proposalId: string) {
  const user = await requireUser();
  try {
    respondToProposal({
      requesterId: user.id,
      proposalId,
      accept: true,
    });
    revalidatePath("/student/proposals");
    revalidatePath("/student/bookings");
    revalidatePath("/tutor/sessions");
  } catch (error) {
    if (error instanceof BusinessError) throw new Error(error.message);
    throw error;
  }
}

export async function rejectProposalAction(proposalId: string) {
  const user = await requireUser();
  try {
    respondToProposal({
      requesterId: user.id,
      proposalId,
      accept: false,
    });
    revalidatePath("/student/proposals");
    revalidatePath("/tutor/proposals");
  } catch (error) {
    if (error instanceof BusinessError) throw new Error(error.message);
    throw error;
  }
}
