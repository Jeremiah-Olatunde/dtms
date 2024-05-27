import { Router } from "express";
import { Order } from "../../../models/Order.js";
import { Tailor } from "../../../models/Tailor.js";
import { ClientRequest } from "../../../models/ClientRequest.js";

import { daysBetweenDates } from "../../../utils/date.js";
import { OrderDesign } from "../../../models/OrderDesign.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const tailor = (await Tailor.findByPk(uid))!;

  const orders = await Order.findAll({
    raw: true,
    where: { tailor: tailor.uid },
  });

  const temp = orders
    .filter(({ status }) => status === "pending")
    .toSorted(({ dueDate: a }, { dueDate: b }) => {
      const daysLeftA = daysBetweenDates(new Date(), a);
      const daysLeftB = daysBetweenDates(new Date(), b);
      return daysLeftA - daysLeftB;
    })
    .map(async (order) => ({
      order,
      design: await OrderDesign.findByPk(order.design, { raw: true }),
    }));

  const pending = await Promise.all(temp);

  const overdueIndex = pending.findIndex(({ order: { dueDate } }) => {
    return 0 < daysBetweenDates(new Date(), dueDate);
  });

  const criticalIndex = pending.findIndex(({ order: { dueDate } }) => {
    return 14 < daysBetweenDates(new Date(), dueDate);
  });

  const overdue = pending.slice(0, overdueIndex);
  const critical = pending.slice(overdueIndex, criticalIndex);
  const ontrack = pending.slice(criticalIndex);

  response.render("pages/dashboard/tailor/home.njk", {
    tailor: tailor.dataValues,
    headsup: [
      {
        label: "Overdue",
        value: overdue.length,
        icon: "/img/critical.png",
        color: "#F91942",
      },
      {
        label: "Critical",
        value: critical.length,
        icon: "/img/critical.png",
        color: "#F2C94C",
      },
      {
        label: "On Track",
        value: ontrack.length,
        icon: "/img/completed.png",
        color: "#1EC38B",
      },
      {
        label: "Client Requests",
        value: await ClientRequest.count({
          where: { status: "pending", tailor: tailor.uid },
        }),
        icon: "/img/requests-white.png",
        color: "#7166F0",
      },
    ],
    urgentOrders: { overdue, critical, ontrack },
  });
});
