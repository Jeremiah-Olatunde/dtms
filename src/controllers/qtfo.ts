import { type ParsedQs } from "qs";
import { type Model } from "sequelize";
import { isArrayString } from "../utils/array.js";

type FetchOptions<T> = {
  limit: number;
  offset: number;
  randomize: boolean;
  sort: { field: NumberPropertyKeys<T>; order: "ASC" | "DESC" }[];
  range: { field: NumberPropertyKeys<T>; min: number; max: number }[];
  match: { field: StringPropertyKeys<T>; pattern: string[] }[];
  fuzzy: { field: StringPropertyKeys<T>; pattern: string[] }[];
};

export function queryToFetchOptions<T extends Model>(
  query: ParsedQs,
): FetchOptions<T> {
  const options: FetchOptions<T> = {
    offset: 0,
    limit: Infinity,
    randomize: false,
    sort: [],
    range: [],
    match: [],
    fuzzy: [],
  };

  if (typeof query.offset === "string") options.offset = parseInt(query.offset);

  if (typeof query.limit === "string") options.limit = parseInt(query.limit);

  if (typeof query.randomize === "string")
    options.randomize = Boolean(+query.randomize);

  for (const key in query) {
    const [action, field] = key.split("-");
    let values = query[key];

    if (typeof values === "string") values = [values];
    else if (!isArrayString(values)) continue;

    if (action === "match" || action === "fuzzy") {
      for (const pattern of values) {
        let xs = options[action].find(({ field: f }) => f === field);
        if (xs === undefined)
          options[action].push({
            field: field as StringPropertyKeys<T>,
            pattern: [pattern],
          });
        else xs.pattern.push(pattern);
      }
    }

    if (action === "sort") {
      for (const order of values) {
        if (order === "ASC" || order === "DESC") {
          options[action].push({
            field: field as NumberPropertyKeys<T>,
            order,
          });
        }
      }
    }

    if (action === "range" && values.length === 2) {
      const [rawMin, rawMax] = values;
      const min = rawMin === "" ? -Infinity : Number(rawMin);
      const max = rawMax === "" ? +Infinity : Number(rawMax);

      if (!isNaN(min) && !isNaN(max))
        options[action].push({
          field: field as NumberPropertyKeys<T>,
          min,
          max,
        });
    }
  }

  return options;
}
