import { Router } from "express";

export const router = Router();

router.get("/", (_, response) => {
  response.render("pages/contact.njk");
});
