
export const MEMO_DEMO_SLUG = "home-2ed38941";

export const memoDemoStates = [
  { id: "email-entry", title: "Email entry", preview: "/memo-state-previews/email-entry.png" },
  { id: "email-loading", title: "Loading", parent: "email-entry", route: "email-attempt", preview: "/memo-state-previews/email-loading.png" },
  { id: "email-error", title: "Error", parent: "email-entry", route: "email-attempt", preview: "/memo-state-previews/email-error.png" },
  { id: "unlocked-memo", title: "Unlocked memo", parent: "email-entry", route: "memo", preview: "/memo-state-previews/unlocked-memo.png" },
] as const;

export type MemoDemoState = (typeof memoDemoStates)[number]["id"];

export function isMemoDemoState(value: unknown): value is MemoDemoState {
  return typeof value === "string" && memoDemoStates.some(state => state.id === value);
}

export function isMemoDemoPrototype(slug: string, route: string): boolean {
  return slug === MEMO_DEMO_SLUG && new URL(route, "http://localhost").pathname === "/memo";
}

