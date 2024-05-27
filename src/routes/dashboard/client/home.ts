import { Router } from "express";
import { Order } from "../../../models/Order.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  const headsUp = {
    orders: {
      pending: await Order.count({
        where: { client: client.uid, status: "pending" },
      }),
      cancelled: await Order.count({
        where: { client: client.uid, status: "cancelled" },
      }),
      completed: await Order.count({
        where: { client: client.uid, status: "completed" },
      }),
    },

    requests: {
      pending: await Order.count({
        where: { client: client.uid, status: "pending" },
      }),
      rejected: await Order.count({
        where: { client: client.uid, status: "cancelled" },
      }),
      accepted: await Order.count({
        where: { client: client.uid, status: "accepted" },
      }),
    },

    responses: {
      pending: await Order.count({
        where: { client: client.uid, status: "pending" },
      }),
      rejected: await Order.count({
        where: { client: client.uid, status: "cancelled" },
      }),
      accepted: await Order.count({
        where: { client: client.uid, status: "accepted" },
      }),
    },
  };

  response.render("pages/dashboard/client/home.njk", {
    client,
    headsUp,
  });
});
