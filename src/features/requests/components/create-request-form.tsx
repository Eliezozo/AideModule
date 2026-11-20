// src/features/requests/components/create-request-form.tsx
"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createRequestAction,
  type ActionState,
} from "@/features/requests/actions";

type Option = { id: string; name: string; facultyId?: string; levelId?: string };

const initialState: ActionState = {};

export function CreateRequestForm({
  faculties,
  levels,
  modules,
}: {
  faculties: Option[];
  levels: Option[];
  modules: Option[];
}) {
  const [facultyId, setFacultyId] = useState(faculties[0]?.id ?? "");
  const [levelId, setLevelId] = useState(levels[0]?.id ?? "");
  const [state, formAction, isPending] = useActionState(
    createRequestAction,
    initialState
  );

  const filteredModules = useMemo(
    () =>
      modules.filter(
        (m) => m.facultyId === facultyId && m.levelId === levelId
      ),
    [modules, facultyId, levelId]
  );

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="facultyId">Filière</Label>
          <select
            id="facultyId"
            name="facultyId"
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            required
          >
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="levelId">Niveau</Label>
          <select
            id="levelId"
            name="levelId"
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm"
            value={levelId}
            onChange={(e) => setLevelId(e.target.value)}
            required
          >
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="moduleId">Module (catalogue)</Label>
          <select
            id="moduleId"
            name="moduleId"
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm"
            required
            defaultValue={filteredModules[0]?.id}
            key={`${facultyId}-${levelId}`}
          >
            {filteredModules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {filteredModules.length === 0 ? (
            <p className="text-xs text-amber-700">
              Aucun module actif pour cette combinaison.
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description de la difficulté</Label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={20}
          placeholder="Explique précisément ce dont tu as besoin..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="preferredMode">Mode souhaité</Label>
          <select
            id="preferredMode"
            name="preferredMode"
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm"
            defaultValue="online"
          >
            <option value="online">En ligne</option>
            <option value="in_person">Présentiel</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredDate">Date / heure souhaitée</Label>
          <Input id="preferredDate" name="preferredDate" type="datetime-local" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredDurationMinutes">Durée (minutes)</Label>
          <Input
            id="preferredDurationMinutes"
            name="preferredDurationMinutes"
            type="number"
            min={30}
            max={240}
            step={30}
            defaultValue={60}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetAmount">Budget facultatif (FCFA)</Label>
        <Input id="budgetAmount" name="budgetAmount" type="number" min={0} />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending || filteredModules.length === 0}>
        {isPending ? "Publication..." : "Publier la demande"}
      </Button>
    </form>
  );
}
