import * as random from "./random.js";

export const daysToMilli = (days: number) => days * 24 * 60 * 60 * 1000;

export function range(startDate: Date, length: number): Date {
  const start = startDate.getTime();
  const duration = daysToMilli(length);
  return new Date(random.range(start, start + duration));
}

// All Chat-GPT
export function daysBetweenDates(date1: Date, date2: Date): number {
  // Convert both dates to UTC
  const utcDate1 = Date.UTC(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
  );
  const utcDate2 = Date.UTC(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
  );

  // Calculate the difference in milliseconds
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = utcDate2 - utcDate1;

  // Convert the difference from milliseconds to days
  const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

  return daysDifference;
}
