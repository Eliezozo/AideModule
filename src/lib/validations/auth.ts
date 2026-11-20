// src/lib/validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court"),
  lastName: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Téléphone invalide").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  studentNumber: z.string().optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
