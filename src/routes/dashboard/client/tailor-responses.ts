import { Router } from "express";
import { nanoid } from "nanoid";

import { Client } from "../../../models/Client.js";
import { Order } from "../../../models/Order.js";
import {
  TailorResponse,
  isTailorResponseStatus,
} from "../../../models/TailorResponse.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  if (!isTailorResponseStatus(status))
    throw new Error(`invalid tailor response status: ${status}`);

  const tailorResponses = await TailorResponse.findAll({
    raw: true,
    where: { client: client.uid, status },
  });

  response.render(`pages/dashboard/client/tailor-responses.njk`, {
    client,
    status,
    tailorResponses,
  });
});

router.get("/view-response/:uid", async (request, response) => {
  const uid = request.params.uid;

  const tailorResponse = await TailorResponse.findByPk(uid, { raw: true });

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uid} not found`);

  response.render("pages/dashboard/client/tailor-responses/view-response.njk", {
    tailorResponse,
  });
});

router.post("/accept-response/:uid", async (request, response) => {
  const uidTailorResponse = request.params.uid;
  const tailorResponse = await TailorResponse.findByPk(uidTailorResponse);

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uidTailorResponse} not found`);

  const uidOrder = nanoid();

  await Order.create({
    uid: uidOrder,

    client: tailorResponse.client,
    tailor: tailorResponse.tailor,
    design: tailorResponse.design,

    acceptedDate: new Date(),
    price: tailorResponse.proposedPrice,
    dueDate: tailorResponse.proposedCompletionDate,
  });

  await tailorResponse.update({ status: "accepted", order: uidOrder });

  response.set("HX-Refresh", "true").end();
});

router.post("/reject-response/:uid", async (request, response) => {
  const uidTailorResponse = request.params.uid;
  const tailorResponse = await TailorResponse.findByPk(uidTailorResponse);

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uidTailorResponse} not found`);

  await tailorResponse.update({ status: "rejected" });
  response.set("HX-Refresh", "true").end();
});
