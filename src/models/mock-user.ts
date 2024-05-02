import { nanoid } from "nanoid";
import { User } from "./model-user.js";
import { faker } from "@faker-js/faker";

function range(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function choice<T>(xs: T[]): T {
  return xs[range(0, xs.length)];
}

export async function createMockUser(
  size: number,
  force: boolean,
): Promise<User[]> {
  if (force) await User.sync({ force });

  const users: User[] = [];

  for (let i = 0; i < size; i++) {
    const gender = choice(["male", "female"] as const);
    const lastName = faker.person.lastName(gender);
    const firstName = faker.person.firstName(gender);
    const uid = nanoid();
    const age = range(18, 65);
    const email = faker.internet.email({ firstName, lastName });
    const phone = faker.phone.number();
    const image = `/img/user (${range(1, 6)}).jpg`;

    users.push(
      await User.create({
        uid,
        age,
        lastName,
        firstName,

        email,
        phone,
        image,
        gender,
      }),
    );
  }

  return users;
}
