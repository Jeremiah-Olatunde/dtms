import "dotenv/config";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import {
  reset,
  mockClients,
  mockTailors,
  mockCredentials,
  mockTailorDesigns,
  mockTailorReviews,
  mockOrderRequests,
  mockOrderResponses,
  mockOrders,
  mockOrderReviews,
} from "../models/mock-models.js";

const base = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/img/mock",
);

await reset();

const clients = await mockClients(1000, {
  baseUrl: "/img/mock/users/clients",
  images: readdirSync(resolve(base, "./users/clients")),
});

const tailors = await mockTailors(100, {
  baseUrl: "/img/mock/users/tailors",
  images: readdirSync(resolve(base, "./users/tailors")),
});

await mockCredentials([...clients, ...tailors]);

await mockTailorDesigns(2000, tailors, {
  baseUrl: "/img/mock/designs/",
  images: readdirSync(resolve(base, "./designs")),
});

await mockTailorReviews(500, tailors, clients);

const requests = await mockOrderRequests(2000, clients, tailors, {
  baseUrl: "/img/mock/designs",
  images: readdirSync(resolve(base, "./designs")),
});

const responses = await mockOrderResponses(requests);
const orders = await mockOrders(responses);
await mockOrderReviews(orders);
