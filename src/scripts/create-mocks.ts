import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import {
  mockClients,
  mockTailors,
  mockDesigns,
  mockLogins,
  mockReviews,
  mockQuotationRequests,
  mockQuotationResponses,
  mockOrders,
} from "../models/mock.js";

const images = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/img/mock",
);

const clients = await mockClients(100, images, true);
const tailors = await mockTailors(25, images, true);

await mockDesigns(500, tailors, images, true);
await mockReviews(500, tailors, clients, true);
await mockLogins([...clients, ...tailors], true);

const quotationRequests = await mockQuotationRequests(
  500,
  clients,
  tailors,
  images,
  true,
);
const quotationResponses = await mockQuotationResponses(
  quotationRequests,
  true,
);
await mockOrders(quotationResponses, true);
