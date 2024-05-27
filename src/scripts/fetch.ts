import "dotenv/config";
import { Credentials } from "../models/Credentials.js";
import { Order } from "../models/Order.js";

const credentials = await Credentials.findAll({
  raw: true,
  where: { usertype: "tailor" },
});

const withCount = await Promise.all(
  credentials.map(async (cred) => {
    return [await Order.count({ where: { tailor: cred.uid } }), cred] as const;
  }),
);

const sorted = withCount.toSorted(([a], [b]) => b - a);

console.log(
  sorted.map(([count, { uid, email, password }]) => [
    count,
    uid,
    email,
    password,
  ]),
);
