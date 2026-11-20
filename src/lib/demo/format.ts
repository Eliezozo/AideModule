// src/lib/demo/format.ts
export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lome",
  }).format(new Date(value));
}

export function fullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`;
}
