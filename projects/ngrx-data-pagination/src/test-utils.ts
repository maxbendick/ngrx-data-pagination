export const waitMs = (timeMs: number) =>
  new Promise(resolve => setTimeout(() => resolve(), timeMs));
