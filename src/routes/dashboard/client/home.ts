import { Router } from "express";
import { Order } from "../../../models/Order.js";

import { Client } from "../../../models/Client.js";
import { OrderDesign } from "../../../models/OrderDesign.js";
import { TailorResponse } from "../../../models/TailorResponse.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid))!;

  const trData = await Promise.all(
    (
      await TailorResponse.findAll({
        raw: true,
        where: { client: client.uid, status: "pending" },
      })
    ).map(async (tailorResponse) => ({
      tailorResponse,
      design: await OrderDesign.findByPk(tailorResponse.design, { raw: true }),
    })),
  );

  response.render("pages/dashboard/client/home.njk", {
    client: client.dataValues,
    headsup: [
      {
        label: "Pending Orders",
        value: await Order.count({
          where: { client: client.uid, status: "pending" },
        }),
        icon: "/img/pending.png",
        color: "#f2c94c",
      },
      {
        label: "cancelled Orders",
        value: await Order.count({
          where: { client: client.uid, status: "cancelled" },
        }),
        icon: "/img/rejected.png",
        color: "firebrick",
      },
      {
        label: "Accepted Responses",
        value: trData.length,
        icon: "/img/requests-white.png",
        color: "#7166F0",
      },
      {
        label: "Rejected Responses",
        value: await TailorResponse.count({
          where: { client: client.uid, status: "rejected" },
        }),
        icon: "/img/rejected.png",
        color: "firebrick",
      },
    ],
    trData,
  });
});
