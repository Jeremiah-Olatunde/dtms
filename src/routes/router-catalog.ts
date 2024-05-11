import { Router } from "express";
import { TYPES, OCCASIONS, GENDERS, GROUPS } from "../models/model-design.js";
import * as DesignController from "../controllers/controller-design.js";

export const router = Router();

router.get("/", async ({ query }, response) => {
  const result = await DesignController.findByQuery(query);
  const {
    results: designs,
    metadata: {
      pagination: { offset, limit },
      filteration: { filtrate: total },
    },
  } = result;

  response.render("view-catalog.njk", {
    query,
    designs,
    offset,
    limit,
    total,
    formData: {
      gender: {
        action: "match",
        display: "Gender",
        options: GENDERS,
      },
      group: {
        action: "match",
        display: "Age Group",
        options: GROUPS,
      },
      occasion: {
        action: "match",
        display: "Occasion",
        options: OCCASIONS,
      },
      type: {
        action: "match",
        display: "Dress Type",
        options: TYPES,
      },
    },
  });
});
