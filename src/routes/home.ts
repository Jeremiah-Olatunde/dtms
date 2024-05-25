import { Router } from "express";

import { sequelize } from "../models/db-connection.js";

import { Client } from "../models/Client.js";
import { OrderReview } from "../models/OrderReview.js";
import { TailorDesign } from "../models/TailorDesign.js";

export const router = Router();

router.get("/", async (_, response) => {
  const designs = await TailorDesign.findAll({
    raw: true,
    limit: 6,
    order: [["ranking", "DESC"], sequelize.random()],
  });

  const reviews = await OrderReview.findAll({
    raw: true,
    limit: 3,
    order: [sequelize.random()],
  });

  const reviewsWithClients = await Promise.all(
    reviews.map(async (review) => {
      const client = await Client.findByPk(review.client, { raw: true });
      if (!client) throw new Error(`Client(uid: ${review.client}) not found`);

      return [client, review];
    }),
  );

  response.render("pages/home.njk", {
    designs,
    reviews: reviewsWithClients,
  });
});
