import { Router } from "express";

import { router as home } from "./tailor/home.js";
import { router as reviews } from "./tailor/reviews.js";
import { router as profile } from "./tailor/profile.js";
import { router as orders } from "./tailor/orders.js";
import { router as clientRequests } from "./tailor/client-requests.js";
import { router as tailorResponses } from "./tailor/tailor-responses.js";

export const router = Router();

router.use("/home", home);
router.use("/reviews", reviews);
router.use("/profile", profile);

router.use("/orders", orders);
router.use("/client-requests", clientRequests);
router.use("/tailor-responses", tailorResponses);
