import { InferCreationAttributes } from "sequelize";

import { Client } from "../models/model-user-client.js";

export async function create(
  create: InferCreationAttributes<Client>,
): Promise<void> {
  await Client.create(create);
}

export async function read(
  key: "uid" | "email",
  value: string,
): Promise<Client | null> {
  return await Client.findOne({ where: { [key]: value } });
}

export async function update(
  uid: string,
  update: InferCreationAttributes<Client, { omit: "uid" }>,
): Promise<void> {
  const client = await Client.findOne({ where: { uid } });
  if (!client) throw new Error(`client(${uid}) not found`);

  await client.update(update);
}
