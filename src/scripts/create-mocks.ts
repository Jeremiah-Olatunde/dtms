import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import {
  mockClients,
  mockTailors,
  mockDesigns,
  mockLogins,
  mockReview,
} from "../models/mock.js";

const images = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/img/mock",
);

const clients = await mockClients(100, images, true);
const tailors = await mockTailors(25, images, true);

await mockDesigns(tailors, images, true);
await mockReview(tailors, clients, true);
await mockLogins([...clients, ...tailors], true);
