import { Router } from "express";
import { nanoid } from "nanoid";

import { Client } from "../../../models/Client.js";
import { Order } from "../../../models/Order.js";
import {
  TailorResponse,
  isTailorResponseStatus,
} from "../../../models/TailorResponse.js";
import { OrderDesign } from "../../../models/OrderDesign.js";
import { Tailor } from "../../../models/Tailor.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  if (!isTailorResponseStatus(status))
    throw new Error(`invalid tailor response status: ${status}`);

  const trData = await Promise.all(
    (
      await TailorResponse.findAll({
        raw: true,
        where: { client: client.uid, status },
        order: [["updatedAt", "DESC"]],
      })
    ).map(async (tailorResponse) => ({
      tailorResponse,
      design: await OrderDesign.findByPk(tailorResponse.design, { raw: true }),
    })),
  );

  response.render(`pages/dashboard/client/tailor-responses.njk`, {
    client,
    status,
    trData,
  });
});

router.get("/response-details/:uid", async (request, response) => {
  const { uid: uidClient } = request.session.user;
  const client = (await Client.findByPk(uidClient, { raw: true }))!;

  const uid = request.params.uid;
  const tailorResponse = await TailorResponse.findByPk(uid, { raw: true });

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uid} not found`);

  const tailor = (await Tailor.findByPk(tailorResponse.tailor, { raw: true }))!;
  const design = (await OrderDesign.findByPk(tailorResponse.design, {
    raw: true,
  }))!;

  response.render(
    "pages/dashboard/client/tailor-responses/response-details.njk",
    {
      tailorResponse,
      client,
      tailor,
      design,
    },
  );
});

router.post("/accept-response/:uid", async (request, response) => {
  const uidTailorResponse = request.params.uid;
  const tailorResponse = await TailorResponse.findByPk(uidTailorResponse);

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uidTailorResponse} not found`);

  const uidOrder = nanoid();

  const or = await Order.create({
    uid: uidOrder,

    client: tailorResponse.client,
    tailor: tailorResponse.tailor,
    design: tailorResponse.design,

    acceptedDate: new Date(),
    price: tailorResponse.proposedPrice,
    dueDate: tailorResponse.proposedCompletionDate,
  });

  await tailorResponse.update({ status: "accepted", order: uidOrder });

  console.log(tailorResponse.dataValues);
  console.log(or.dataValues);

  response.redirect(
    `/dashboard/client/tailor-responses/response-details/${uidTailorResponse}`,
  );
});

router.post("/reject-response/:uid", async (request, response) => {
  const uidTailorResponse = request.params.uid;
  const tailorResponse = await TailorResponse.findByPk(uidTailorResponse);

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uidTailorResponse} not found`);

  await tailorResponse.update({ status: "rejected" });

  response.redirect(
    `/dashboard/client/tailor-responses/response-details/${uidTailorResponse}`,
  );
});
