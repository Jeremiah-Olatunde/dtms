import { Router } from "express";
import { Client } from "../../../models/Client.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const client = await Client.findByPk(uid, { raw: true });
  response.render("pages/dashboard/client/profile.njk", { client });
});
