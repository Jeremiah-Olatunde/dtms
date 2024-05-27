import { Router } from "express";

import { Order, isOrderStatus } from "../../../models/Order.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  if (!isOrderStatus(status))
    throw new Error(`invalid order status: ${status}`);

  const orders = await Order.findAll({
    raw: true,
    where: { client: client.uid, status },
  });

  response.render(`pages/dashboard/client/orders.njk`, {
    client,
    status,
    orders,
  });
});
