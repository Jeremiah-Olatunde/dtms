import { Router } from "express";
import { User } from "../models/model-user.js";

export const router = Router();

router.get("/", async (_, response) => {
  const users = await User.findAll();
  response.render("view-home.njk", { users });
});
