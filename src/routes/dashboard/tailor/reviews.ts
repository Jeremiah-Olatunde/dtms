import { Router } from "express";
import { OrderReview } from "../../../models/OrderReview.js";
import { Tailor } from "../../../models/Tailor.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const tailor = (await Tailor.findByPk(uid, { raw: true }))!;

  const rData = await Promise.all(
    (
      await OrderReview.findAll({
        raw: true,
        where: { tailor: tailor.uid },
        order: [["updatedAt", "DESC"]],
      })
    ).map(async (review) => ({
      review,
      client: await Client.findByPk(review.client, { raw: true }),
    })),
  );

  response.render("pages/dashboard/tailor/reviews.njk", { tailor, rData });
});
