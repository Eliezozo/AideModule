// src/features/requests/components/proposal-form.tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProposalAction,
  type ActionState,
} from "@/features/requests/actions";

const initialState: ActionState = {};

export function ProposalForm({
  requestId,
  defaultMode,
  defaultDuration,
}: {
  requestId: string;
  defaultMode: "online" | "in_person";
  defaultDuration: number;
}) {
  const [state, formAction, isPending] = useActionState(
    createProposalAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="requestId" value={requestId} />
      <h3 className="font-semibold">Accepter ou contre-proposer</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="proposedMode">Mode</Label>
          <select
            id="proposedMode"
            name="proposedMode"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
            defaultValue={defaultMode}
          >
            <option value="online">En ligne</option>
            <option value="in_person">Présentiel</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Tarif horaire (FCFA)</Label>
          <Input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            min={500}
            defaultValue={2500}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Durée (min)</Label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={30}
            max={240}
            defaultValue={defaultDuration}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proposedDate">Créneau proposé</Label>
          <Input id="proposedDate" name="proposedDate" type="datetime-local" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message (facultatif)</Label>
        <Textarea id="message" name="message" />
      </div>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-700">{state.success}</p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Envoi..." : "Envoyer la proposition"}
      </Button>
    </form>
  );
}
