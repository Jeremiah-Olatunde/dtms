import { join, relative } from "path";
import { readdirSync } from "fs";

import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

import { Login } from "./model-login.js";
import { Review } from "./model-review.js";
import { Tailor, SOCIALS, Socials } from "./model-user-tailor.js";
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

import * as date from "../utils/date.js";
import * as array from "../utils/array.js";
import * as random from "../utils/random.js";
import { OrderDesign } from "./OrderDesign.js";
import { QuotationRequest } from "./QuotationRequest.js";
import { QuotationResponse } from "./QuotationResponse.js";
import { Order } from "./Order.js";

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
    const gender = random.choice(["male", "female"] as const);
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);

    const phone = random.choice(phonePrefixes) + faker.string.numeric(8);
    const email = faker.internet.email({ firstName, lastName });
    const address = faker.location.streetAddress({ useFullAddress: true });
    const filteredImages = images
      .map((image) => image.split(/[-.]/))
      .filter(array.subsetOf([gender, "client"]))
      .map((xs) => xs.slice(0, -1).join("-") + "." + xs.at(-1));

    const image = toImageUrl(imageDir, random.choice(filteredImages));

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
    const phone = random.choice(phonePrefixes) + faker.string.numeric(8);

    const account = faker.finance.accountNumber();
    const bank = random.choice(["zenith", "first bank", "fcmb", "access"]);
    const address = faker.location.streetAddress({ useFullAddress: true });

    const filteredImages = images
      .map((image) => image.split(/[-.]/))
      .filter(array.subsetOf(["tailor"]))
      .map((xs) => xs.slice(0, -1).join("-") + "." + xs.at(-1));

    const image = toImageUrl(imageDir, random.choice(filteredImages));

    const socials = Object.fromEntries(
      SOCIALS.map((key) => [
        key,
        `https://${key}/${faker.internet.userName({ firstName, lastName })}`,
      ]),
    ) as Socials;

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
  size: number,
  tailors: Tailor[],
  imageDir: string,
  reset: boolean,
): Promise<Design[]> {
  if (reset) await Design.sync({ force: true });
  const designs: Design[] = [];

  for (let i = 0; i < size; i++) {
    const { uid: tailor } = random.choice(tailors);
    const images: string[] = readdirSync(imageDir);

    const uid = nanoid();
    const ranking = random.range(5, 10);
    const price = random.range(10_000, 1_000_000);
    const description = faker.lorem.sentence(3);

    const image = random.choice(images);
    const labels = image.split("-").slice(0, -1) as any[];

    const type = labels.find((l) => TYPES.includes(l)) ?? random.choice(TYPES);
    const group =
      labels.find((l) => GROUPS.includes(l)) ?? random.choice(GROUPS);
    const style =
      labels.find((l) => STYLES.includes(l)) ?? random.choice(STYLES);
    const gender =
      labels.find((l) => GENDERS.includes(l)) ?? random.choice(GENDERS);
    const occasion =
      labels.find((l) => OCCASIONS.includes(l)) ?? random.choice(OCCASIONS);

    designs.push(
      await Design.create({
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
}

export async function mockDesignsComplete(
  tailors: Tailor[],
  imageDir: string,
  reset: boolean,
): Promise<Design[]> {
  if (reset) await Design.sync({ force: true });

  return Promise.all(
    tailors.flatMap(({ uid: tailor }): Promise<Design>[] => {
      const designs: Promise<Design>[] = [];
      const images: string[] = readdirSync(imageDir);

      for (let i = 0; i < random.range(50, 100); i++) {
        const uid = nanoid();
        const ranking = random.range(5, 10);
        const price = random.range(10_000, 1_000_000);
        const description = faker.lorem.sentence(3);

        const image = random.choice(images);
        const labels = image.split("-").slice(0, -1) as any[];

        const type =
          labels.find((l) => TYPES.includes(l)) ?? random.choice(TYPES);
        const group =
          labels.find((l) => GROUPS.includes(l)) ?? random.choice(GROUPS);
        const style =
          labels.find((l) => STYLES.includes(l)) ?? random.choice(STYLES);
        const gender =
          labels.find((l) => GENDERS.includes(l)) ?? random.choice(GENDERS);
        const occasion =
          labels.find((l) => OCCASIONS.includes(l)) ?? random.choice(OCCASIONS);

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

export async function mockReviews(
  size: number,
  tailors: Tailor[],
  clients: Client[],
  reset: boolean,
): Promise<Review[]> {
  if (reset) await Review.sync({ force: true });
  const reviews: Review[] = [];

  for (let i = 0; i < size; i++) {
    reviews.push(
      await Review.create({
        uid: nanoid(),
        rating: random.range(3, 10),
        text: faker.lorem.paragraph(6),
        client: random.choice(clients).uid,
        tailor: random.choice(tailors).uid,
      }),
    );
  }

  return reviews;
}

export async function mockReviewsComplete(
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

export async function mockQuotationRequests(
  size: number,
  clients: Client[],
  tailors: Tailor[],
  imageDir: string,
  reset: boolean,
): Promise<QuotationRequest[]> {
  if (reset) {
    await OrderDesign.sync({ force: true });
    await QuotationRequest.sync({ force: true });
  }
  const quotationRequests: QuotationRequest[] = [];

  for (let i = 0; i < size; i++) {
    const uid = nanoid();

    const { uid: client } = random.choice(clients);
    const { uid: tailor } = random.choice(tailors);
    const { uid: design } = await OrderDesign.create({
      uid: nanoid(),
      image: toImageUrl(imageDir, random.choice(readdirSync(imageDir))),
      description: faker.lorem.sentence(3),
    });

    quotationRequests.push(
      await QuotationRequest.create({
        uid,
        client,
        tailor,
        design,
        response: null,
        status: "pending",
      }),
    );
  }

  return quotationRequests;
}

export async function mockQuotationResponses(
  quotationRequests: QuotationRequest[],
  reset?: boolean,
): Promise<QuotationResponse[]> {
  if (reset) await QuotationResponse.sync({ force: true });
  const quotationResponses: QuotationResponse[] = [];

  for (const quotationRequest of quotationRequests) {
    const status = random.choice(["pending", "rejected", "accepted"] as const);

    switch (status) {
      case "pending":
        continue;
      case "rejected":
        await quotationRequest.update({ status: "rejected" });
        continue;
      case "accepted":
        await quotationRequest.update({ status: "accepted" });
        break;
    }

    const uid = nanoid();
    await quotationRequest.update({ response: uid });

    quotationResponses.push(
      await QuotationResponse.create({
        uid,
        order: null,
        status: "pending",
        tailor: quotationRequest.tailor,
        client: quotationRequest.client,
        design: quotationRequest.design,
        completion: date.range(new Date(), 90),
        price: random.range(10_000, 1_000_000),
      }),
    );
  }

  return quotationResponses;
}

export async function mockOrders(
  quotationResponses: QuotationResponse[],
  reset?: boolean,
): Promise<Order[]> {
  if (reset) await Order.sync({ force: true });
  const orders: Order[] = [];

  for (const quotationResponse of quotationResponses) {
    const status = random.choice(["pending", "rejected", "accepted"] as const);

    switch (status) {
      case "pending":
        continue;
      case "rejected":
        await quotationResponse.update({ status: "rejected" });
        continue;
      case "accepted":
        await quotationResponse.update({ status: "accepted" });
        break;
    }

    const uid = nanoid();
    await quotationResponse.update({ order: uid });

    orders.push(
      await Order.create({
        uid,
        status: "pending",
        timeline: "on track",
        acceptedDate: new Date(),
        dueDate: quotationResponse.completion,

        price: quotationResponse.price,
        tailor: quotationResponse.tailor,
        client: quotationResponse.client,
        design: quotationResponse.design,
      }),
    );
  }

  return orders;
}

export async function reset() {
  await Client.sync({ force: true });
  await Tailor.sync({ force: true });
  await Login.sync({ force: true });
  await Design.sync({ force: true });
  await Review.sync({ force: true });
}
