
export const earlyAccessStates = [
  { id: "idle", title: "Idle", preview: "/early-access-state-previews/idle-rounded-blocks-20261115.png" },
  { id: "invalid-email", title: "Email error", parent: "idle", preview: "/early-access-state-previews/invalid-email-rounded-blocks-20261115.png" },
  { id: "submitting", title: "Submitting", parent: "idle", preview: "/early-access-state-previews/submitting-rounded-blocks-20261115.png" },
  { id: "error", title: "Error", parent: "idle", preview: "/early-access-state-previews/error-rounded-blocks-20261115.png" },
  { id: "success", title: "Success", parent: "submitting", preview: "/early-access-state-previews/success-rounded-blocks-20261115.png" },
] as const;

export type EarlyAccessState = (typeof earlyAccessStates)[number]["id"];

export function isEarlyAccessState(value: unknown): value is EarlyAccessState {
  return typeof value === "string" && earlyAccessStates.some((state) => state.id === value);
}

export function isEarlyAccessPrototype(prototypeId: string | null): boolean {
  return prototypeId === "efafd092-bc49-43a2-85f3-e386d7815a1e";
}

