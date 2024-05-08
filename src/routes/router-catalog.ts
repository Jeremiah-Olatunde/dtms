import { Router } from "express";
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
        options: ["male", "female"],
      },
      group: {
        action: "match",
        display: "Age Group",
        options: ["adults", "kids"],
      },
      occassion: {
        action: "match",
        display: "Occasion",
        options: ["casual", "business", "formal"],
      },
      type: {
        action: "match",
        display: "Dress Type",
        options: [
          "blouse",
          "coat",
          "dress",
          "jacket",
          "jumpsuit",
          "shirt",
          "shorts",
          "skirt",
          "suit",
          "swimwear",
          "trousers",
          "two-peice",
        ],
      },
    },
  });
});
