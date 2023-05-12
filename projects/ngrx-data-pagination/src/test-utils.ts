export const waitMs = (timeMs: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), timeMs));
