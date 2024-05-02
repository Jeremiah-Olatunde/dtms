import { Router } from "express";

import { sequelize } from "../models/db.js";
import { Design } from "../models/model-design.js";
import { Review } from "../models/model-review.js";
import { Client } from "../models/model-user-client.js";

export const router = Router();

router.get("/", async (_, response) => {
  const designs = await Design.findAll({
    limit: 6,
    order: [["ranking", "DESC"], sequelize.random()],
  });

  const reviews = await Review.findAll({
    limit: 3,
    order: [sequelize.random()],
  });

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

  response.render("view-home.njk", {
    designs,
    reviews: reviewsWithClients,
  });
});
