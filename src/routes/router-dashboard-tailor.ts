import { Router } from "express";
import * as T from "../controllers/controller-tailor.js"

export const router = Router();

router.get("/", async (request, response) => {
  const { uid } = request.session.user!;
  const tailor = await T.read("uid", uid);
  if(!tailor) throw new Error(`Tailor(${uid}) not found`)

  response.render("view-dashboard-tailor.njk", { tailor });
});