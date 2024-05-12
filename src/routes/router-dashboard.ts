import { Router } from "express";

import { router as tailor } from "./router-dashboard-tailor.js";
import { router as client } from "./router-dashboard-client.js";

export const router = Router();
router.use("/tailor", tailor);
router.use("/client", client);

router.get("/", async (request, response) => {
  const { usertype } = request.session.user!;
  response.redirect(`/dashboard/${usertype}`);
});
