import { Router, request, response } from "express";
import * as TailorController from "../controllers/controller-tailor.js";
import * as DesignController from "../controllers/controller-design.js";
import * as ReviewController from "../controllers/controller-review.js";

import { Tailor } from "../models/model-user-tailor.js";
import { Review } from "../models/model-review.js";
import { Design } from "../models/model-design.js";
import { Client } from "../models/model-user-client.js";

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

router.get("/profile/:uid", async (request, response) => {
  const tailor = await Tailor.findOne({ where: { uid: request.params.uid } });
  if (!tailor) throw new Error(`tailor(${request.params.uid}) not found`);

  response.render("view-tailor-profile.njk", { tailor });
});

router.get("/designs", async ({ query }, response) => {
  const { results: designs, metadata } =
    await DesignController.findByQuery(query);

  console.log(query);
  response.render("view-tailor-profile-designs.njk", {
    query,
    designs,
    ...metadata,
  });
});

router.get("/reviews", async ({ query }, response) => {
  const { results: reviews, metadata } =
    await ReviewController.findByQuery(query);

  const reviewsWithClients = await Promise.all(
    reviews.map(async (review) => {
      const client = await Client.findOne({ where: { uid: review.client } });
      if (!client) throw new Error(`client(uid: ${review.client}) not found`);

      return {
        ...review.dataValues,
        client: client.dataValues,
      };
    }),
  );

  console.log(query);
  response.render("view-tailor-profile-reviews.njk", {
    query,
    reviews: reviewsWithClients,
    ...metadata,
  });
});
