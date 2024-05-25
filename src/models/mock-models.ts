import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

import * as date from "../utils/date.js";
import * as random from "../utils/random.js";

import { Credentials } from "./Credentials.js";
import { Tailor, SOCIALS, Socials } from "./Tailor.js";
import { Client, GENDERS, MEASUREMENTS } from "./Client.js";
import {
  TailorDesign,
  isType,
  isGroup,
  isStyle,
  isGender,
  isOccasion,
} from "./TailorDesign.js";

import { Order } from "./Order.js";
import { OrderDesign } from "./OrderDesign.js";
import { QuotationRequest } from "./QuotationRequest.js";
import { QuotationResponse } from "./QuotationResponse.js";
import { OrderReview } from "./OrderReview.js";

const phonePrefixes = ["070", "081", "080", "090"];

export async function mockCredentials(
  users: (Tailor | Client)[],
): Promise<Credentials[]> {
  return Promise.all(
    users.map((user): Promise<Credentials> => {
      return Credentials.create({
        uid: user.uid,
        email: user.email,
        // NOTE: password not hashed for testing purposes
        password: faker.internet.password(),
        usertype: user instanceof Tailor ? "tailor" : "client",
      });
    }),
  );
}

export async function mockClients(
  size: number,
  imageData: {
    baseUrl: string;
    images: string[];
  },
): Promise<Client[]> {
  const clients: Client[] = [];
  const genderedImages = {
    male: imageData.images.filter((i) => i.startsWith("male")),
    female: imageData.images.filter((i) => i.startsWith("female")),
  };

  for (let i = 0; i < size; i++) {
    const gender = random.choice(GENDERS);
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);

    clients.push(
      await Client.create({
        gender,
        lastName,
        firstName,
        uid: nanoid(),
        email: faker.internet.email({
          firstName,
          lastName,
          allowSpecialCharacters: true,
        }),
        phone: random.choice(phonePrefixes) + faker.string.numeric(8),
        image: `${imageData.baseUrl}/${random.choice(genderedImages[gender])}`,
        address: faker.location.streetAddress({ useFullAddress: true }),
        measurements: Object.fromEntries(
          MEASUREMENTS.map((key) => [key, random.range(8, 40)]),
        ),
      }),
    );
  }

  return clients;
}

export async function mockTailors(
  size: number,
  imageData: {
    baseUrl: string;
    images: string[];
  },
): Promise<Tailor[]> {
  const tailors: Tailor[] = [];

  for (let i = 0; i < size; i++) {
    const lastName = faker.person.lastName();
    const firstName = faker.person.firstName();

    tailors.push(
      await Tailor.create({
        lastName,
        firstName,
        uid: nanoid(),
        about: faker.lorem.paragraph(6),
        email: faker.internet.email({
          firstName,
          lastName,
          allowSpecialCharacters: true,
        }),
        phone: random.choice(phonePrefixes) + faker.string.numeric(8),
        image: `${imageData.baseUrl}/${random.choice(imageData.images)}`,

        bank: random.choice(["zenith", "first bank", "fcmb", "access"]),
        account: faker.finance.accountNumber(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        socials: Object.fromEntries(
          SOCIALS.map((key) => [
            key,
            `https://${key}/${faker.internet.userName({ firstName, lastName })}`,
          ]),
        ) as Socials,
      }),
    );
  }

  return tailors;
}

export async function mockTailorDesigns(
  size: number,
  tailors: Tailor[],
  imageData: {
    baseUrl: string;
    images: string[];
  },
): Promise<TailorDesign[]> {
  const designs: TailorDesign[] = [];

  for (let i = 0; i < size; i++) {
    const image = random.choice(imageData.images);
    const labels = image.split("-").slice(0, -1);

    designs.push(
      await TailorDesign.create({
        uid: nanoid(),
        tailor: random.choice(tailors).uid,

        ranking: random.range(5, 10),
        price: random.range(10_000, 1_000_000),

        title: faker.lorem.sentence(3),
        description: faker.lorem.paragraph(6),
        image: `${imageData.baseUrl}/${image}`,

        type: labels.find(isType),
        style: labels.find(isStyle),
        group: labels.find(isGroup),
        gender: labels.find(isGender),
        occasion: labels.find(isOccasion),
      }),
    );
  }

  return designs;
}

export async function mockQuotationRequests(
  size: number,
  clients: Client[],
  tailors: Tailor[],
  imageData: {
    baseUrl: string;
    images: string[];
  },
): Promise<QuotationRequest[]> {
  const quotationRequests: QuotationRequest[] = [];

  for (let i = 0; i < size; i++) {
    const design = await OrderDesign.create({
      uid: nanoid(),
      title: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(6),
      image: `${imageData.baseUrl}/${random.choice(imageData.images)}`,
    });

    quotationRequests.push(
      await QuotationRequest.create({
        uid: nanoid(),
        design: design.uid,
        client: random.choice(clients).uid,
        tailor: random.choice(tailors).uid,
      }),
    );
  }

  return quotationRequests;
}

export async function mockQuotationResponses(
  quotationRequests: QuotationRequest[],
): Promise<QuotationResponse[]> {
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

export async function mockOrderReviews(
  orders: Order[],
): Promise<OrderReview[]> {
  const reviews: OrderReview[] = [];

  for (const order of orders) {
    const status = random.choice([
      "pending",
      "cancelled",
      "completed",
    ] as const);

    switch (status) {
      case "pending":
        continue;
      case "cancelled":
        await order.update({ status: "cancelled" });
        continue;
      case "completed":
        await order.update({ status: "completed" });
        break;
    }

    reviews.push(
      await OrderReview.create({
        uid: nanoid(),
        rating: random.range(3, 10),
        content: faker.lorem.paragraph(4),

        order: order.uid,
        tailor: order.tailor,
        client: order.client,
      }),
    );
  }

  return reviews;
}

export async function reset() {
  await Credentials.sync({ force: true });

  await Client.sync({ force: true });
  await Tailor.sync({ force: true });
  await TailorDesign.sync({ force: true });

  await Order.sync({ force: true });
  await OrderReview.sync({ force: true });
  await OrderDesign.sync({ force: true });
  await QuotationRequest.sync({ force: true });
  await QuotationResponse.sync({ force: true });
}
