import { readdirSync, copyFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import { zip } from "../utils/array.js";

const DIRECTORY = dirname(fileURLToPath(import.meta.url));
const filenames = readdirSync(resolve(DIRECTORY, "../public/img/mock"));
const parsed = filenames.map((dirname) => dirname.split(/[-.]/));

//--- FORMATING NUMBERS -------------------------------------------------------
const removed = parsed.map((xs) =>
  xs.map((x) =>
    x
      .split("")
      .filter((c) => isNaN(parseInt(c)))
      .join(""),
  ),
);

const seperated = removed.map((xs) => [xs.slice(0, -1), xs.at(-1)!] as const);

let curr = "";
let count = 0;

const numbered = seperated.map(([xs, ext]) => {
  const filename = xs.join("-");
  if (filename === curr) {
    return `${filename}-${count++}.${ext}`;
  } else {
    count = 1;
    curr = filename;
    return `${filename}-${0}.${ext}`;
  }
});

const zipped = zip(
  filenames.map((name) => resolve(DIRECTORY, "../public/img/mock", name)),
)(
  numbered.map((name) =>
    resolve(DIRECTORY, "../public/img/mock/renamed", name),
  ),
);
zipped.map(([original, copy], i) => {
  try {
    copyFileSync(original, copy);
  } catch {
    console.log(i, "failed", original, copy);
  }
});
//-----------------------------------------------------------------------------

//--- FORMATING AGE GROUP-----------------------------------------------------
// change adult -> adults and kid -> kids
const newnames = parsed.map((filename) => {
  const corrected = filename.map((part) => {
    if (part === "adult" || part === "kid") return part + "s";
    else return part;
  });
  return corrected.slice(0, -1).join("-") + "." + corrected.at(-1);
});

zip(filenames)(newnames).map(([prev, next], i) => {
  const oldPath = resolve(DIRECTORY, "../public/img/mock", prev);
  const newPath = resolve(DIRECTORY, "../public/img/mock/renamed", next);
  try {
    copyFileSync(oldPath, newPath);
  } catch {
    console.log(i, "failed to copy from (", prev, ") to next (", next, ")");
  }
});
//-----------------------------------------------------------------------------
