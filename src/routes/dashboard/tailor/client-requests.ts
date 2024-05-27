import { Router } from "express";
import { nanoid } from "nanoid";

import {
  ClientRequest,
  isClientRequestStatus,
} from "../../../models/ClientRequest.js";

import { Tailor } from "../../../models/Tailor.js";
import { TailorResponse } from "../../../models/TailorResponse.js";
import { OrderDesign } from "../../../models/OrderDesign.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const tailor = (await Tailor.findByPk(uid, { raw: true }))!;

  if (!isClientRequestStatus(status))
    throw new Error(`invalid client request status: ${status}`);

  const crData = await Promise.all(
    (
      await ClientRequest.findAll({
        raw: true,
        where: { tailor: tailor.uid, status },
        order: [["updatedAt", "DESC"]],
      })
    ).map(async (clientRequest) => ({
      clientRequest,
      design: await OrderDesign.findByPk(clientRequest.design, { raw: true }),
    })),
  );

  response.render(`pages/dashboard/tailor/client-requests.njk`, {
    tailor,
    status,
    crData,
  });
});

router.get("/request-details/:uid", async (request, response) => {
  const { uid: uidTailor } = request.session.user;
  const tailor = (await Tailor.findByPk(uidTailor, { raw: true }))!;

  const uid = request.params.uid;
  const clientRequest = await ClientRequest.findByPk(uid, { raw: true });

  if (clientRequest === null)
    throw new Error(`Tailor Response with uid ${uid} not found`);

  const client = (await Client.findByPk(clientRequest.client, { raw: true }))!;
  const design = (await OrderDesign.findByPk(clientRequest.design, {
    raw: true,
  }))!;

  response.render(
    "pages/dashboard/tailor/client-requests/request-details.njk",
    {
      clientRequest,
      client,
      tailor,
      design,
    },
  );
});

router.post("/accept-request/:uid", async (request, response) => {
  const proposedPrice = +request.body.proposedPrice;
  const proposedCompletionDate = new Date(request.body.proposedCompletionDate);

  if (isNaN(proposedPrice)) throw new Error("Invalid price entered");

  if (isNaN(proposedCompletionDate.getTime()))
    throw new Error("Invalid date entered");

  console.log(proposedPrice, proposedCompletionDate);

  const uidClientRequest = request.params.uid;
  const clientRequest = await ClientRequest.findByPk(uidClientRequest);

  if (clientRequest === null)
    throw new Error(`Client Request with uid ${uidClientRequest} not found`);

  const uidTailorResponse = nanoid();

  const tr = await TailorResponse.create({
    uid: uidTailorResponse,

    client: clientRequest.client,
    tailor: clientRequest.tailor,
    design: clientRequest.design,

    proposedPrice,
    proposedCompletionDate,
  });

  await clientRequest.update({
    status: "accepted",
    response: uidTailorResponse,
  });

  console.log(clientRequest.dataValues);
  console.log(tr.dataValues);

  response.redirect(
    `/dashboard/tailor/client-requests/request-details/${uidClientRequest}`,
  );
});

router.post("/reject-request/:uid", async (request, response) => {
  const uidClientRequest = request.params.uid;
  const clientRequest = await ClientRequest.findByPk(uidClientRequest);

  if (clientRequest === null)
    throw new Error(`Tailor Response with uid ${uidClientRequest} not found`);

  await clientRequest.update({ status: "rejected" });
  response.redirect(
    `/dashboard/tailor/client-requests/request-details/${uidClientRequest}`,
  );
});
