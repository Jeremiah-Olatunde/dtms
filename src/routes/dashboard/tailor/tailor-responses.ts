import { Router } from "express";

import {
  TailorResponse,
  isTailorResponseStatus,
} from "../../../models/TailorResponse.js";
import { Tailor } from "../../../models/Tailor.js";
import { OrderDesign } from "../../../models/OrderDesign.js";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/:status", async (request, response) => {
  const status = request.params.status;
  const { uid } = request.session.user;
  const tailor = (await Tailor.findByPk(uid, { raw: true }))!;

  if (!isTailorResponseStatus(status))
    throw new Error(`invalid tailor response status: ${status}`);

  const trData = await Promise.all(
    (
      await TailorResponse.findAll({
        raw: true,
        where: { tailor: tailor.uid, status },
        order: [["updatedAt", "DESC"]],
      })
    ).map(async (tailorResponse) => ({
      tailorResponse,
      design: await OrderDesign.findByPk(tailorResponse.design, { raw: true }),
    })),
  );

  response.render(`pages/dashboard/tailor/tailor-responses.njk`, {
    tailor,
    status,
    trData,
  });
});

router.get("/response-details/:uid", async (request, response) => {
  const { uid: uidTailor } = request.session.user;
  const tailor = (await Tailor.findByPk(uidTailor, { raw: true }))!;

  const uid = request.params.uid;
  const tailorResponse = await TailorResponse.findByPk(uid, { raw: true });

  if (tailorResponse === null)
    throw new Error(`Tailor Response with uid ${uid} not found`);

  const client = (await Client.findByPk(tailorResponse.client, { raw: true }))!;
  const design = (await OrderDesign.findByPk(tailorResponse.design, {
    raw: true,
  }))!;

  response.render(
    "pages/dashboard/tailor/tailor-responses/response-details.njk",
    {
      tailorResponse,
      client,
      tailor,
      design,
    },
  );
});
