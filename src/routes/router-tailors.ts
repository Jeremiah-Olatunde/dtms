import { Router } from "express";
import * as TailorController from "../controllers/controller-tailor.js";

export const router = Router();

router.get("/", async ({ query }, response) => {
  const result = await TailorController.findByQuery(query);
  const {
    results: tailors,
    metadata: { pagination, filteration },
  } = result;

  response.render("view-tailors.njk", {
    query,
    tailors,
    pagination,
    filteration,
  });
});
