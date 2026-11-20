// src/lib/demo/store.ts
import { createSeedStore } from "@/lib/demo/seed";
import type { DemoStore } from "@/lib/demo/types";

const globalForDemo = globalThis as typeof globalThis & {
  __campusTutorStore?: DemoStore;
};

export function getStore(): DemoStore {
  if (!globalForDemo.__campusTutorStore) {
    globalForDemo.__campusTutorStore = createSeedStore();
  }
  return globalForDemo.__campusTutorStore;
}

export function resetStore() {
  globalForDemo.__campusTutorStore = createSeedStore();
  return globalForDemo.__campusTutorStore;
}

export function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function nowIso() {
  return new Date().toISOString();
}
