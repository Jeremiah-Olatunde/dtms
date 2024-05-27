import { Router } from "express";
import { router as client } from "./dashboard/client.js";
import { router as tailor } from "./dashboard/tailor.js";

import { Credentials } from "../models/Credentials.js";
import { Order } from "../models/Order.js";

export const router = Router();

router.get("/mock-login-details", async (_, response) => {
  const credentials = await Credentials.findAll({
    raw: true,
    where: { usertype: "tailor" },
  });

  const withCount = await Promise.all(
    credentials.map(async (cred) => {
      return [
        await Order.count({ where: { tailor: cred.uid } }),
        cred,
      ] as const;
    }),
  );

  const sorted = withCount.toSorted(([a], [b]) => b - a);

  response.json(sorted);
});

router.use((request, response, next) => {
  const user = request.session.user;

  if (user === undefined) {
    response.redirect("/auth/login");
    return;
  }

  next();
});

router.get("/", (request, response) => {
  const { usertype } = request.session.user!;
  response.redirect(`/dashboard/${usertype}/home`);
});

router.use("/client", client);
router.use("/tailor", tailor);

router.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) throw error;
    response.clearCookie(process.env.SESSION_NAME || "default");
    response.redirect("/home");
  });
});
