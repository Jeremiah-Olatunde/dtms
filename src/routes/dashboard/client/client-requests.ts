import { Router } from "express";

import {
  ClientRequest,
  isClientRequestStatus,
} from "../../../models/ClientRequest.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const client = (await Client.findByPk(uid, { raw: true }))!;

  if (!isClientRequestStatus(status))
    throw new Error(`invalid client request status: ${status}`);

  const clientRequests = await ClientRequest.findAll({
    raw: true,
    where: { client: client.uid, status },
  });

  response.render(`pages/dashboard/client/client-requests.njk`, {
    client,
    status,
    clientRequests,
  });
});

router.get("/view-request/:uid", async (request, response) => {
  const uid = request.params.uid;
  const clientRequest = await ClientRequest.findByPk(uid, { raw: true });

  if (clientRequest === null)
    throw new Error(`Tailor Response with uid ${uid} not found`);

  response.render("pages/dashboard/client/client-requests/view-request.njk", {
    clientRequest,
  });
});
