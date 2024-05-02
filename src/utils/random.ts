export function choice<T>(args: readonly T[]): T {
  return args[range(0, args.length)];
}

export function range(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function shuffle<T>(xs: T[]): T[] {
  return xs.slice().sort(() => Math.random() - 0.5);
}

export function pick<T>(count: number, from: T[]): T[] {
  return shuffle(from).slice(0, count);
}
