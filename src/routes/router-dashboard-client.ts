import { Router, response } from "express";
import * as T from "../controllers/controller-tailor.js";
import * as C from "../controllers/controller-client.js";
import * as R from "../controllers/controller-review.js";

export const router = Router();

router.use((request, response, next) => {
  console.log("route guard", request.session.user);
  if (request.session.user !== undefined) next();
  else response.redirect("/auth/login");
});

router.get("/", (_, response) => {
  response.redirect("/dashboard/client/home");
});

router.get("/reviews", (_, response) => {
  response.redirect("/dashboard/client/reviews/0");
});

router.get("/reviews/:page", async (request, response) => {
  const { uid } = request.session.user!;
  const client = await C.read("uid", uid);
  if (!client) throw new Error(`Client(${uid}) not found`);

  const { results, metadata } = await R.findByQuery({
    limit: "3",
    offset: (+request.params.page * 3).toString(),
    "match-client": [uid],
  });

  const reviews = await Promise.all(
    results.map(async (review) => {
      const tailor = await T.read("uid", review.tailor);
      if (!tailor) throw new Error(`tailor(uid: ${review.tailor}) not found`);

      return {
        ...review.dataValues,
        tailor: tailor.dataValues,
      };
    }),
  );

  response.render("view-dashboard-client-reviews.njk", {
    client,
    reviews,
    ...metadata,
  });
});

router.get("/profile", async (request, response) => {
  const { uid } = request.session.user!;
  const client = await C.read("uid", uid);
  if (!client) throw new Error(`Client(${uid}) not found`);

  response.render("view-dashboard-client-profile.njk", {
    client,
  });
});
