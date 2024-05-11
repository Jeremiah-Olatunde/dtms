import { Router } from "express";
import { MEASUREMENTS } from "../models/model-user-client.js";
import { SOCIALS } from "../models/model-user-tailor.js";

export const router = Router();

router.get("/login", (_, response) => {
  response.render("view-auth-login.njk");
});

router.get("/signup", (_, response) => {
  response.render("view-auth-signup.njk", { MEASUREMENTS, SOCIALS });
});

router.post("/signup", (request, _) => {
  console.log(request.body);
});
