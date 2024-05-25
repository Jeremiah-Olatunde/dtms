import bcrypt from "bcrypt";
import { Credentials } from "../models/Credentials.js";
import { nanoid } from "nanoid";

export async function create({
  email,
  hashed,
  usertype,
}: {
  email: string;
  hashed: string;
  usertype: "client" | "tailor";
}): Promise<string> {
  if (await read("email", email)) {
    throw new Error(`email(${email}) already exists`);
  }

  const uid = nanoid();
  const password = await bcrypt.hash(hashed, 10);

  await Credentials.create({ uid, email, password, usertype });

  return uid;
}

export async function read(
  key: "uid" | "email",
  value: string,
): Promise<Credentials | null> {
  return await Credentials.findOne({ raw: true, where: { [key]: value } });
}

export async function update(
  uid: string,
  { email, password }: { email?: string; password?: string },
): Promise<void> {
  const cred = await read("uid", uid);

  if (!cred) {
    throw new Error(`uid(${uid}) not found`);
  }

  const hashed = password && (await bcrypt.hash(password, 10));
  await cred.update({ email, password: hashed });
}

export async function login(
  email: string,
  password: string,
): Promise<Credentials> {
  const cred = await read("email", email);

  if (cred === null) {
    throw new Error(`email(${email}) does not exist`);
  }

  if (password === cred.password) {
    return cred;
  }

  if (!(await bcrypt.compare(password, cred.password))) {
    throw new Error("incorrect password");
  }

  return cred;
}
