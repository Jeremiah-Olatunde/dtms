import { Router } from "express";

import {
  ClientRequest,
  isClientRequestStatus,
} from "../../../models/ClientRequest.js";
import { Client } from "../../../models/Client.js";
import { OrderDesign } from "../../../models/OrderDesign.js";
import { Tailor } from "../../../models/Tailor.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  if (!isClientRequestStatus(status))
    throw new Error(`invalid client request status: ${status}`);

  const crData = await Promise.all(
    (
      await ClientRequest.findAll({
        raw: true,
        where: { client: client.uid, status },
        order: [["updatedAt", "DESC"]],
      })
    ).map(async (clientRequest) => ({
      clientRequest,
      design: await OrderDesign.findByPk(clientRequest.design, { raw: true }),
    })),
  );

  response.render(`pages/dashboard/client/client-requests.njk`, {
    client,
    status,
    crData,
  });
});

router.get("/request-details/:uid", async (request, response) => {
  const { uid: uidClient } = request.session.user;
  const client = (await Client.findByPk(uidClient, { raw: true }))!;

  const uid = request.params.uid;
  const clientRequest = await ClientRequest.findByPk(uid, { raw: true });

  if (clientRequest === null)
    throw new Error(`Tailor Response with uid ${uid} not found`);

  const tailor = (await Tailor.findByPk(clientRequest.tailor, { raw: true }))!;
  const design = (await OrderDesign.findByPk(clientRequest.design, {
    raw: true,
  }))!;

  response.render(
    "pages/dashboard/client/client-requests/request-details.njk",
    {
      clientRequest,
      client,
      tailor,
      design,
    },
  );
});
