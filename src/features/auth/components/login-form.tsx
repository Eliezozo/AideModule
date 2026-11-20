// src/features/auth/components/login-form.tsx
"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginAction,
  quickLoginAction,
  type AuthActionState,
} from "@/features/auth/actions";

const initialState: AuthActionState = {};

const demos = [
  { email: "alice@etudiant.tg", label: "Alice (demandeur)" },
  { email: "bruno@etudiant.tg", label: "Bruno (aidant validé)" },
  { email: "claire@etudiant.tg", label: "Claire (aidant en attente)" },
  { email: "admin@campus.tg", label: "Admin — ouvrir l’administration" },
];

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );
  const [isQuickPending, startQuick] = useTransition();

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="alice@etudiant.tg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="demo1234"
          />
        </div>
        {state.error ? (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Comptes démo (mot de passe : demo1234)
        </p>
        <div className="grid gap-2">
          {demos.map((demo) => (
            <Button
              key={demo.email}
              type="button"
              variant="outline"
              className="justify-start"
              disabled={isQuickPending}
              onClick={() => startQuick(() => quickLoginAction(demo.email))}
            >
              {demo.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
