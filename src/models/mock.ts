import { join, relative } from "path";
import { readdirSync } from "fs";

import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

import { Login } from "./model-login.js";
import { Review } from "./model-review.js";
import { Tailor, SOCIALS } from "./model-user-tailor.js";
import { Client, MEASUREMENTS } from "./model-user-client.js";
import { Design, TYPES, OCCASSIONS } from "./model-design.js";

import * as random from "../utils/random.js";

function toImageUrl(directory: string, filename: string): string {
  const fullPath = join(directory, filename);
  const publicPath = "D:\\coding\\projects\\dtms\\src\\public";
  return "/" + relative(publicPath, fullPath).replaceAll("\\", "/");
}

export async function mockClients(
  size: number,
  imageDir: string,
  reset?: boolean,
): Promise<Client[]> {
  if (reset) await Client.sync({ force: true });

  const clients: Client[] = [];

  for (let i = 0; i < size; i++) {
    const uid = nanoid();
    const gender = random.choice(["male", "female"] as const);
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);

    const phone = faker.string.numeric(11);
    const email = faker.internet.email({ firstName, lastName });
    const image = toImageUrl(
      `${imageDir}\\${gender}`,
      random.choice(readdirSync(`${imageDir}\\${gender}`)),
    );

    const measurements = Object.fromEntries(
      MEASUREMENTS.map((key) => [key, random.range(8, 40)]),
    );

    clients.push(
      await Client.create({
        uid,
        email,
        phone,
        image,
        gender,
        lastName,
        firstName,
        measurements,
      }),
    );
  }

  return clients;
}

export async function mockTailors(
  size: number,
  imageDir: string,
  reset?: boolean,
): Promise<Tailor[]> {
  if (reset) await Tailor.sync({ force: true });

  const tailors: Tailor[] = [];
  const images: string[] = readdirSync(imageDir);

  for (let i = 0; i < size; i++) {
    const uid = nanoid();
    const lastName = faker.person.lastName();
    const firstName = faker.person.firstName();

    const image = toImageUrl(imageDir, random.choice(images));
    const phone = faker.string.numeric(11);
    const email = faker.internet.email({ firstName, lastName });
    const about = faker.lorem.paragraph(6);
    const bank = random.choice(["zenith", "first bank", "fcmb", "access"]);
    const account = faker.finance.accountNumber();
    const location = faker.location.streetAddress();

    const socials = Object.fromEntries(
      SOCIALS.map((key) => [
        key,
        `https://${key}/${faker.internet.userName({ firstName, lastName })}`,
      ]),
    );

    tailors.push(
      await Tailor.create({
        uid,
        email,
        phone,
        image,
        lastName,
        firstName,
        socials,
        about,
        bank,
        account,
        location,
      }),
    );
  }

  return tailors;
}

export async function mockLogins(
  users: (Tailor | Client)[],
  reset: boolean,
): Promise<Login[]> {
  if (reset) await Login.sync({ force: true });

  return Promise.all(
    users.map((user): Promise<Login> => {
      return Login.create({
        uid: user.uid,
        email: user.email,
        hashed: faker.internet.password(),
        usertype: user instanceof Tailor ? "tailor" : "client",
      });
    }),
  );
}

export async function mockDesigns(
  tailors: Tailor[],
  imageDir: string,
  reset: boolean,
): Promise<Design[]> {
  if (reset) await Design.sync({ force: true });

  return Promise.all(
    tailors.flatMap(({ uid: tailor }): Promise<Design>[] => {
      const designs: Promise<Design>[] = [];

      for (let i = 0; i < random.range(50, 100); i++) {
        const uid = nanoid();
        const ranking = random.range(5, 10);
        const price = random.range(10_000, 1_000_000);
        const description = faker.lorem.sentence(3);

        const type = random.choice(TYPES);
        const occassion = random.choice(OCCASSIONS);
        const group = random.choice(["adults", "kids"] as const);
        const gender = random.choice(["male", "female"] as const);
        const style = random.choice(["english", "traditional"] as const);

        const image = toImageUrl(
          `${imageDir}\\${gender}`,
          random.choice(readdirSync(`${imageDir}\\${gender}`)),
        );

        designs.push(
          Design.create({
            uid,
            tailor,
            ranking,
            price,
            description,
            type,
            occassion,
            group,
            gender,
            style,
            image,
          }),
        );
      }

      return designs;
    }),
  );
}

export async function mockReview(
  tailors: Tailor[],
  clients: Client[],
  reset: boolean,
): Promise<Review[]> {
  if (reset) await Review.sync({ force: true });

  return Promise.all(
    tailors.flatMap(({ uid: tailor }): Promise<Review>[] => {
      const cs = random.pick(random.range(0, clients.length), clients);
      return cs.map(({ uid: client }) => {
        return Review.create({
          uid: nanoid(),
          client,
          tailor,
          text: faker.lorem.paragraph(6),
          rating: random.range(3, 10),
        });
      });
    }),
  );
}
