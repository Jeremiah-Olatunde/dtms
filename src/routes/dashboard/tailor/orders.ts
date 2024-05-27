import { Router } from "express";

import { Order, isOrderStatus } from "../../../models/Order.js";
import { Tailor } from "../../../models/Tailor.js";
import { Client } from "../../../models/Client.js";
import { OrderDesign } from "../../../models/OrderDesign.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const tailor = (await Tailor.findByPk(uid, { raw: true }))!;

  if (!isOrderStatus(status))
    throw new Error(`invalid order status: ${status}`);

  console.log(uid);

  const temp = (
    await Order.findAll({
      raw: true,
      where: { tailor: tailor.uid, status },
      order: [["updatedAt", "DESC"]],
    })
  ).map(async (order) => ({
    order,
    design: await OrderDesign.findByPk(order.design, { raw: true }),
  }));

  const orders = await Promise.all(temp);

  response.render(`pages/dashboard/tailor/orders.njk`, {
    tailor,
    status,
    orders,
  });
});

router.get("/order-details/:uid", async (request, response) => {
  const { uid: uidTailor } = request.session.user;
  const tailor = (await Tailor.findByPk(uidTailor, { raw: true }))!;

  const uidOrder = request.params.uid;
  const order = await Order.findByPk(uidOrder);
  if (order === null) throw new Error(`Order with uid ${uidOrder} not found`);

  const client = (await Client.findByPk(order.client, { raw: true }))!;
  const design = (await OrderDesign.findByPk(order.design, { raw: true }))!;

  response.render("pages/dashboard/tailor/orders/order-details.njk", {
    tailor,
    client,
    order,
    design,
  });
});

router.post("/cancel-order/:uid", async (request, response) => {
  const uidOrder = request.params.uid;
  const order = await Order.findByPk(uidOrder);

  if (order === null) throw new Error(`Order with uid ${uidOrder} not found`);

  await order.update({ status: "cancelled" });
  response.redirect(`/dashboard/tailor/orders/order-details/${uidOrder}`);
});

router.post("/complete-order/:uid", async (request, response) => {
  const uidOrder = request.params.uid;
  const order = await Order.findByPk(uidOrder);

  if (order === null) throw new Error(`Order with uid ${uidOrder} not found`);

  await order.update({ status: "completed" });
  response.redirect(`/dashboard/tailor/orders/order-details/${uidOrder}`);
});
