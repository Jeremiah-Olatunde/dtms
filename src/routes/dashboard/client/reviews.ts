import { Router } from "express";
import { OrderReview } from "../../../models/OrderReview.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  const reviews = await OrderReview.findAll({
    raw: true,
    where: { client: client.uid },
  });

  response.render("pages/dashboard/client/reviews.njk", { reviews, client });
});
