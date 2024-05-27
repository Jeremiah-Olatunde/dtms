import { Router } from "express";
import { Tailor } from "../../../models/Tailor.js";

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user;
  const tailor = await Tailor.findByPk(uid, { raw: true });
  response.render("pages/dashboard/tailor/profile.njk", { tailor });
});
