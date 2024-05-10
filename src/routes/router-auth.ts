import { Router } from "express";

export const router = Router();

router.get("/login", (_, response) => {
  response.render("view-auth-login.njk");
});
