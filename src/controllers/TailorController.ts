import fuzzy from "fuzzy";
import { ParsedQs } from "qs";
import { InferCreationAttributes } from "sequelize";

import { Tailor } from "../models/Tailor.js";
import { queryToFetchOptions } from "./qtfo.js";

export async function create(
  create: InferCreationAttributes<Tailor>,
): Promise<void> {
  await Tailor.create(create);
}

export async function read(
  key: "uid" | "email",
  value: string,
): Promise<Tailor | null> {
  return Tailor.findOne({ where: { [key]: value } });
}

export async function findByQuery(query: ParsedQs): Promise<{
  results: Tailor[];
  metadata: {
    result: number;
    pagination: { offset: number; limit: number };
    filteration: { residue: number; filtrate: number };
  };
}> {
  const options = queryToFetchOptions<Tailor>(query);

  let residue = 0;
  let filtrate = 0;

  const results = (await Tailor.findAll())
    .filter((record) => {
      let keep = true;

      if (options.match.length !== 0)
        keep &&= options.match.every(({ field, pattern }) => {
          return pattern.some((p) => p === record[field]);
        });

      if (options.fuzzy.length !== 0)
        keep &&= options.fuzzy.every(({ field, pattern }) => {
          return pattern.some((p) => fuzzy.test(p, record[field]));
        });

      if (options.range.length !== 0)
        keep &&= options.range.every(({ field, min, max }) => {
          return min <= record[field] && record[field] <= max;
        });

      if (keep) filtrate++;
      else residue++;

      return keep;
    })
    .sort((a, b) => {
      if (options.randomize) return Math.random() - 0.5;

      for (const { field, order } of options.sort) {
        const ordering =
          order === "ASC" ? a[field] - b[field] : b[field] - a[field];
        if (ordering === 0) continue;
        return ordering;
      }

      return 0;
    })
    .slice(options.offset ?? 0, options.offset + options.limit);

  return {
    results,
    metadata: {
      result: results.length,
      filteration: { residue, filtrate },
      pagination: {
        offset: options.offset ?? 0,
        limit: options.limit ?? results.length,
      },
    },
  };
}
