export function isArrayString(xs: any): xs is string[] {
  return Array.isArray(xs) && xs.every((x) => typeof x === "string");
}

export function isArrayNumber(xs: any): xs is number[] {
  return Array.isArray(xs) && xs.every((x) => typeof x === "number");
}

export function isArrayBoolean(xs: any): xs is boolean[] {
  return Array.isArray(xs) && xs.every((x) => typeof x === "boolean");
}
