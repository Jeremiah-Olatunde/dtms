import bcrypt from "bcrypt";
import { Login } from "../models/model-login.js";
import { nanoid } from "nanoid";

export async function create({
  email,
  password,
  usertype,
}: {
  email: string;
  password: string;
  usertype: "client" | "tailor";
}): Promise<string> {
  if (await read("email", email)) {
    throw new Error(`email(${email}) already exists`);
  }

  const uid = nanoid();
  const hashed = await bcrypt.hash(password, 10);

  await Login.create({ uid, email, hashed, usertype });

  return uid;
}

export async function read(
  key: "uid" | "email",
  value: string,
): Promise<Login | null> {
  return await Login.findOne({ where: { [key]: value } });
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
  await cred.update({ email, hashed });
}

export async function login(email: string, password: string): Promise<Login> {
  const cred = await read("email", email);

  if (cred === null) {
    throw new Error(`email(${email}) does not exist`);
  }

  if(password === cred.hashed){
    return cred;
  }

  if (!(await bcrypt.compare(password, cred.hashed))) {
    throw new Error("incorrect password");
  } 

  return cred;
}
