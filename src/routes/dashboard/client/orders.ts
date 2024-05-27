import { Router } from "express";

import { Order, isOrderStatus } from "../../../models/Order.js";
import { Client } from "../../../models/Client.js";
import { OrderDesign } from "../../../models/OrderDesign.js";
import { Tailor } from "../../../models/Tailor.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  if (!isOrderStatus(status))
    throw new Error(`invalid order status: ${status}`);

  console.log(uid);

  const temp = (
    await Order.findAll({
      raw: true,
      where: { client: client.uid, status },
      order: [["updatedAt", "DESC"]],
    })
  ).map(async (order) => ({
    order,
    design: await OrderDesign.findByPk(order.design, { raw: true }),
  }));

  const orders = await Promise.all(temp);

  response.render(`pages/dashboard/client/orders.njk`, {
    client,
    status,
    orders,
  });
});

router.get("/order-details/:uid", async (request, response) => {
  const { uid: uidClient } = request.session.user;
  const client = (await Client.findByPk(uidClient, { raw: true }))!;

  const uidOrder = request.params.uid;
  const order = await Order.findByPk(uidOrder);
  if (order === null) throw new Error(`Order with uid ${uidOrder} not found`);

  const tailor = (await Tailor.findByPk(order.tailor, { raw: true }))!;
  const design = (await OrderDesign.findByPk(order.design, { raw: true }))!;

  response.render("pages/dashboard/client/orders/order-details.njk", {
    tailor,
    client,
    design,
    order,
  });
});
