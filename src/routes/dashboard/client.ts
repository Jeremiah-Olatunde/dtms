import { Router } from "express";

import { router as home } from "./client/home.js";
import { router as reviews } from "./client/reviews.js";
import { router as profile } from "./client/profile.js";
import { router as orders } from "./client/orders.js";
import { router as clientRequests } from "./client/client-requests.js";
import { router as tailorResponses } from "./client/tailor-responses.js";

export const router = Router();

router.use("/home", home);
router.use("/reviews", reviews);
router.use("/profile", profile);

router.use("/orders", orders);
router.use("/client-requests", clientRequests);
router.use("/tailor-responses", tailorResponses);
