import { Router } from "express";

export const router = Router();

router.get("/", (_, response) => {
  response.render("view-contact.njk");
});
