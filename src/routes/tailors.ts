import { Router } from "express";

import * as TailorController from "../controllers/TailorController.js";
import * as ReviewController from "../controllers/OrderReviewController.js";
import * as DesignController from "../controllers/TailorDesignController.js";

import { Tailor } from "../models/Tailor.js";
import { Client } from "../models/Client.js";

export const router = Router();

router.get("/", async ({ query }, response) => {
  const result = await TailorController.findByQuery(query);
  const {
    results: tailors,
    metadata: { pagination, filteration },
  } = result;

  response.render("pages/tailor-catalog.njk", {
    query,
    tailors,
    pagination,
    filteration,
  });
});

router.get("/profile/:uid", async (request, response) => {
  const tailor = await Tailor.findOne({ where: { uid: request.params.uid } });
  if (!tailor) throw new Error(`tailor(${request.params.uid}) not found`);

  response.render("pages/tailor-profile.njk", { tailor });
});

router.get("/designs", async ({ query }, response) => {
  const { results: designs, metadata } =
    await DesignController.findByQuery(query);

  response.render("pages/tailor-profile/designs.njk", {
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
  response.render("pages/tailor-profile/reviews.njk", {
    query,
    reviews: reviewsWithClients,
    ...metadata,
  });
});
