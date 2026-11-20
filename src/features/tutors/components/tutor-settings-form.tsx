// src/features/tutors/components/tutor-settings-form.tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyTutorAction, type ActionState } from "@/features/tutors/actions";

const initialState: ActionState = {};

export function TutorSettingsForm({
  defaultBio,
  defaultPhone,
  defaultProvider,
}: {
  defaultBio?: string | null;
  defaultPhone?: string | null;
  defaultProvider?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    applyTutorAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="bio">Bio / Présentation</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={defaultBio ?? ""}
          placeholder="Décris brièvement ton parcours et tes compétences…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payoutPhone">Numéro de reversement</Label>
        <Input
          id="payoutPhone"
          name="payoutPhone"
          type="tel"
          defaultValue={defaultPhone ?? ""}
          placeholder="+228 90 00 00 00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payoutProvider">Opérateur</Label>
        <select
          id="payoutProvider"
          name="payoutProvider"
          defaultValue={defaultProvider ?? "TMONEY"}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
        >
          <option value="TMONEY">T-Money</option>
          <option value="MOOV">Moov Money</option>
          <option value="FLOOZ">Flooz</option>
        </select>
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-700">{state.success}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Envoi en cours…" : "Soumettre la demande"}
      </Button>
    </form>
  );
}
