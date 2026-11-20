// src/lib/validations/request.ts
import { z } from "zod";

export const createRequestSchema = z.object({
  facultyId: z.string().min(1, "Filière invalide"),
  levelId: z.string().min(1, "Niveau invalide"),
  moduleId: z.string().min(1, "Module invalide — choisissez dans le catalogue"),
  description: z
    .string()
    .min(20, "Décrivez votre difficulté (au moins 20 caractères)"),
  preferredMode: z.enum(["online", "in_person"]),
  preferredDate: z.string().optional().or(z.literal("")),
  preferredDurationMinutes: z.coerce
    .number()
    .int()
    .min(30, "Durée minimum : 30 minutes")
    .max(240, "Durée maximum : 4 heures"),
  budgetAmount: z.coerce.number().int().min(0).optional().nullable(),
});

export const createProposalSchema = z.object({
  requestId: z.string().min(1),
  proposedMode: z.enum(["online", "in_person"]),
  hourlyRate: z.coerce.number().int().min(500, "Tarif minimum : 500 FCFA/h"),
  durationMinutes: z.coerce.number().int().min(30).max(240),
  proposedDate: z.string().optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type CreateProposalInput = z.infer<typeof createProposalSchema>;
