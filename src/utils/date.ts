import * as random from "./random.js";

export const daysToMilli = (days: number) => days * 24 * 60 * 60 * 1000;

export function range(startDate: Date, length: number): Date {
  const start = startDate.getTime();
  const duration = daysToMilli(length);
  return new Date(random.range(start, start + duration));
}
