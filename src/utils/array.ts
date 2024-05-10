export function isArrayString(xs: any): xs is string[] {
  return Array.isArray(xs) && xs.every((x) => typeof x === "string");
}

export function isArrayNumber(xs: any): xs is number[] {
  return Array.isArray(xs) && xs.every((x) => typeof x === "number");
}

export function isArrayBoolean(xs: any): xs is boolean[] {
  return Array.isArray(xs) && xs.every((x) => typeof x === "boolean");
}

export function zip<T>(xs: T[]) {
  return function <U>(ys: U[]) {
    const zipped: [T, U][] = [];
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
      zipped.push([xs[i], ys[i]]);
    }
    return zipped;
  };
}

export function subsetOf(xs: any[]) {
  return function (ys: any[]) {
    return xs.every((x) => ys.includes(x));
  };
}

export function supersetOf(xs: any[]) {
  return function (ys: any[]) {
    return ys.every((x) => xs.includes(x));
  };
}
