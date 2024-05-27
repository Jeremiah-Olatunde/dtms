import { Router } from "express";
import { OrderReview } from "../../../models/OrderReview.js";
import { Tailor } from "../../../models/Tailor.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  const rData = await Promise.all(
    (
      await OrderReview.findAll({
        raw: true,
        where: { client: client.uid },
        order: [["updatedAt", "DESC"]],
      })
    ).map(async (review) => ({
      review,
      tailor: await Tailor.findByPk(review.tailor, { raw: true }),
    })),
  );

  response.render("pages/dashboard/client/reviews.njk", { client, rData });
});
