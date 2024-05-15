import { Router } from "express";
import * as T from "../controllers/controller-tailor.js";
import * as C from "../controllers/controller-client.js";
import * as R from "../controllers/controller-review.js";

import {
  isQuotationRequestState,
  QuotationRequest,
} from "../models/QuotationRequest.js";

import { OrderDesign } from "../models/OrderDesign.js";
import { Tailor } from "../models/model-user-tailor.js";

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

router.get("/quotations", (_, response) => {
  response.redirect("quotations/requests/pending/0");
});

router.get("/quotations/requests/:status/:page", async (request, response) => {
  /**
   * TODO
   * Create a validate query function
   * Possibly a type guard
   * Create a valid query type
   * type guard enforces this type
   * */

  const page = +request.params.page!;
  const status = request.params.status;

  if (!isQuotationRequestState(status)) throw new Error("Invalid query");

  /**
   * TODO
   * Create a function for retrieving the client
   * Consider storing the entirity of the client in the session
   * Prevent having to refetch the client on every request
   * */
  const { uid } = request.session.user!;
  const client = await C.read("uid", uid);
  if (!client) throw new Error(`Client(${uid}) not found`);

  const quotationRequests = await QuotationRequest.findAll({
    limit: 10,
    offset: page * 10,
    where: { client: uid },
  });

  const results = await Promise.all(
    quotationRequests.map(async (qr) => {
      const tailor = await Tailor.findOne({ where: { uid: qr.tailor } });
      const design = await OrderDesign.findOne({ where: { uid: qr.design } });

      if (!tailor) throw new Error(`Tailor(${qr.tailor}) not found`);
      if (!design) throw new Error(`Design(${qr.design}) not found`);

      return { qr, design, tailor };
    }),
  );

  response.render(`view-dashboard-client-quotation-requests.njk`, {
    results,
    client,
  });
});

router.get("/quotations/responses/:status/:page", async () => {});

router.get("/quotation-requests/view/:uid", async (request, response) => {
  const { uid } = request.session.user!;
  const client = await C.read("uid", uid);
  if (!client) throw new Error(`Client(${uid}) not found`);

  const uidQr = request.query.view;
  if (!(typeof uidQr === "string")) throw new Error("Invalid Query");

  const qr = await QuotationRequest.findOne({ where: { uid: uidQr } });
  if (!qr) throw new Error(`Quotation Request (uid:${uidQr}) not found`);

  const design = await OrderDesign.findOne({ where: { uid: qr.design } });
  if (!design) throw new Error(`Order Design (uid:${design}) not found`);

  response.render("unimplemented", { qr, design });
});
