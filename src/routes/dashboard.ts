import { Router } from "express";
import { router as client } from "./dashboard/client.js";
import { router as tailor } from "./dashboard/tailor.js";

import { Credentials } from "../models/Credentials.js";
import { Order } from "../models/Order.js";
import { Tailor } from "../models/Tailor.js";
import { Client } from "../models/Client.js";

export const router = Router();

router.get("/get-details/tailor/:email", async (request, response) => {
  const tailor = await Tailor.findOne({
    where: { email: request.params.email },
    raw: true,
  });
  response.json(tailor);
});

router.get("/get-details/client/:email", async (request, response) => {
  const client = await Client.findOne({
    where: { email: request.params.email },
    raw: true,
  });
  response.json(client);
});

router.get("/mock-login-details", async (_, response) => {
  let tailors;

  {
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

    tailors = withCount.toSorted(([a], [b]) => b - a);
  }

  let clients;

  {
    const credentials = await Credentials.findAll({
      raw: true,
      where: { usertype: "client" },
    });

    const withCount = await Promise.all(
      credentials.map(async (cred) => {
        return [
          await Order.count({ where: { client: cred.uid } }),
          cred,
        ] as const;
      }),
    );

    clients = withCount.toSorted(([a], [b]) => b - a);
  }

  response.json({
    tailors,
    clients,
  });
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

//hello world
