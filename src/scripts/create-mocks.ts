import "dotenv/config";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import {
  reset,
  mockClients,
  mockTailors,
  mockTailorDesigns,
  mockCredentials,
  mockOrders,
  mockOrderReviews,
  mockQuotationRequests,
  mockQuotationResponses,
} from "../models/mock-models.js";

const base = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/img/mock",
);

await reset();

const clients = await mockClients(20, {
  baseUrl: "/img/mock/users/clients",
  images: readdirSync(resolve(base, "./users/clients")),
});

const tailors = await mockTailors(5, {
  baseUrl: "/img/mock/users/tailors",
  images: readdirSync(resolve(base, "./users/tailors")),
});

await mockCredentials([...clients, ...tailors]);

await mockTailorDesigns(100, tailors, {
  baseUrl: "/img/mock/designs/",
  images: readdirSync(resolve(base, "./designs")),
});

const requests = await mockQuotationRequests(750, clients, tailors, {
  baseUrl: "/img/mock/designs",
  images: readdirSync(resolve(base, "./designs")),
});

const responses = await mockQuotationResponses(requests);
const orders = await mockOrders(responses);
await mockOrderReviews(orders);
