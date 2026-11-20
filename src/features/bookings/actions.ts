// src/features/bookings/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  BusinessError,
  confirmSessionCompletion,
  disputeBooking,
} from "@/lib/demo/business";
import { requireUser } from "@/lib/demo/session";

export async function confirmSessionAction(bookingId: string) {
  const user = await requireUser();
  try {
    confirmSessionCompletion({ userId: user.id, bookingId });
    revalidatePath("/student/bookings");
    revalidatePath("/tutor/sessions");
    revalidatePath("/tutor/earnings");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/finance");
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    throw error;
  }
}

export async function disputeBookingAction(bookingId: string) {
  const user = await requireUser();
  try {
    disputeBooking({ userId: user.id, bookingId });
    revalidatePath("/student/bookings");
    revalidatePath("/tutor/sessions");
    revalidatePath("/admin/bookings");
  } catch (error) {
    if (error instanceof BusinessError) return { error: error.message };
    throw error;
  }
}
