import { join, relative } from "path";
import { readdirSync } from "fs";

import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

import { Login } from "./model-login.js";
import { Review } from "./model-review.js";
import { Tailor, SOCIALS } from "./model-user-tailor.js";
import { Client, MEASUREMENTS } from "./model-user-client.js";
import {
  Design,
  Type,
  TYPES,
  Occasion,
  OCCASIONS,
  Gender,
  GENDERS,
  Style,
  STYLES,
  Group,
  GROUPS,
} from "./model-design.js";

import { range, choice, pick } from "../utils/random.js";
import { subsetOf } from "../utils/array.js";

function toImageUrl(directory: string, filename: string): string {
  const fullPath = join(directory, filename);
  const publicPath = "D:\\coding\\projects\\dtms\\src\\public";
  return "/" + relative(publicPath, fullPath).replaceAll("\\", "/");
}

const phonePrefixes = ["070", "081", "080", "090"];

export async function mockClients(
  size: number,
  imageDir: string,
  reset?: boolean,
): Promise<Client[]> {
  if (reset) await Client.sync({ force: true });

  const clients: Client[] = [];
  const images: string[] = readdirSync(imageDir);

  for (let i = 0; i < size; i++) {
    const uid = nanoid();
    const gender = choice(["male", "female"] as const);
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);

    const phone = choice(phonePrefixes) + faker.string.numeric(8);
    const email = faker.internet.email({ firstName, lastName });
    const address = faker.location.streetAddress({ useFullAddress: true });
    const filteredImages = images
      .map((image) => image.split(/[-.]/))
      .filter(subsetOf([gender, "client"]))
      .map((xs) => xs.slice(0, -1).join("-") + "." + xs.at(-1));

    const image = toImageUrl(imageDir, choice(filteredImages));

    const measurements = Object.fromEntries(
      MEASUREMENTS.map((key) => [key, range(8, 40)]),
    );

    clients.push(
      await Client.create({
        uid,
        email,
        phone,
        image,
        gender,
        address,
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

    const about = faker.lorem.paragraph(6);
    const email = faker.internet.email({ firstName, lastName });
    const phone = choice(phonePrefixes) + faker.string.numeric(8);

    const account = faker.finance.accountNumber();
    const bank = choice(["zenith", "first bank", "fcmb", "access"]);
    const address = faker.location.streetAddress({ useFullAddress: true });

    const filteredImages = images
      .map((image) => image.split(/[-.]/))
      .filter(subsetOf(["tailor"]))
      .map((xs) => xs.slice(0, -1).join("-") + "." + xs.at(-1));

    const image = toImageUrl(imageDir, choice(filteredImages));

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
        about,
        lastName,
        firstName,

        bank,
        account,
        address,
        socials,
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
      const images: string[] = readdirSync(imageDir);

      for (let i = 0; i < range(50, 100); i++) {
        const uid = nanoid();
        const ranking = range(5, 10);
        const price = range(10_000, 1_000_000);
        const description = faker.lorem.sentence(3);

        const image = choice(images);
        const labels = image.split("-").slice(0, -1) as any[];

        const type = labels.find((l) => TYPES.includes(l)) ?? choice(TYPES);
        const group = labels.find((l) => GROUPS.includes(l)) ?? choice(GROUPS);
        const style = labels.find((l) => STYLES.includes(l)) ?? choice(STYLES);
        const gender =
          labels.find((l) => GENDERS.includes(l)) ?? choice(GENDERS);
        const occasion =
          labels.find((l) => OCCASIONS.includes(l)) ?? choice(OCCASIONS);

        designs.push(
          Design.create({
            uid,
            tailor,
            ranking,
            price,
            description,
            image: toImageUrl(imageDir, image),
            type: type as Type,
            occasion: occasion as Occasion,
            group: group as Group,
            gender: gender as Gender,
            style: style as Style,
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
      const cs = pick(range(0, clients.length), clients);
      return cs.map(({ uid: client }) => {
        return Review.create({
          uid: nanoid(),
          client,
          tailor,
          text: faker.lorem.paragraph(6),
          rating: range(3, 10),
        });
      });
    }),
  );
}

export async function reset() {
  await Client.sync({ force: true });
  await Tailor.sync({ force: true });
  await Login.sync({ force: true });
  await Design.sync({ force: true });
  await Review.sync({ force: true });
}
