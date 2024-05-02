import { Router } from "express";
import { User } from "../models/model-user.js";

export const router = Router();

router.get("/:uid", async (request, response) => {
  console.log("hello there");
  const uid = request.params.uid;
  const user = await User.findOne({ where: { uid } });

  if (!user) throw new Error(`user(uid: ${uid}) not found`);
  response.render("view-user.njk", { user });
});
