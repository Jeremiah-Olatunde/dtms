import { Router } from "express";

import { SOCIALS } from "../models/Tailor.js";
import { MEASUREMENTS } from "../models/Client.js";

import * as TailorController from "../controllers/TailorController.js";
import * as ClientController from "../controllers/ClientController.js";
import * as CredentialsController from "../controllers/CredentialsController.js";

export const router = Router();

router.get("/login", (_, response) => {
  response.render("pages/auth-login.njk");
});

router.post("/login", async (request, response) => {
  try {
    const { uid, usertype } = await CredentialsController.login(
      request.body.email,
      request.body.password,
    );

    request.session.user = { uid, usertype };
    response.render("pages/auth/validation-success.njk");
  } catch (error) {
    if (!(error instanceof Error)) throw new Error(`unknown error${error}`);

    response.render("pages/auth/validation-error.njk", {
      reason: error.message,
    });
  }
});

router.get("/signup", (_, response) => {
  response.render("pages/auth-signup.njk", { MEASUREMENTS, SOCIALS });
});

router.post("/signup", async (request, response) => {
  const form = request.body;

  try {
    if (form.usertype === "default")
      throw new Error("Account type not specified");

    validatePhone(form.phone);
    validateEmail(form.email);
    validateName(form.lastName);
    validateName(form.firstName);
    validatePassword(form.password, form.confirm);

    const uid = await CredentialsController.create({
      email: form.email,
      hashed: form.password,
      usertype: form.usertype,
    });

    if (form.usertype === "tailor") {
      await TailorController.create({
        uid: uid as string,
        email: form.email as string,
        phone: form.phone as string,
        address: form.address as string,
        lastName: form.lastName as string,
        firstName: form.firstName as string,
        socials: {
          facebook: (form.socials.facebook as string) ?? null,
          instagram: (form.socials.instagram as string) ?? null,
          linkedin: (form.socials.linkedin as string) ?? null,
          twitter: (form.socials.twitter as string) ?? null,
        },
      });
    } else {
      console.log(form.measurements);
      console.log(
        Object.fromEntries(Array.from(Object.entries(form.measurements))),
      );

      await ClientController.create({
        uid: uid as string,
        email: form.email as string,
        phone: form.phone as string,
        gender: form.gender as "male" | "female",
        address: form.address as string,
        lastName: form.lastName as string,
        firstName: form.firstName as string,
        measurements: Object.fromEntries(
          Array.from(Object.entries(form.measurements)),
        ),
      });
    }

    console.log(uid);

    request.session.user = { uid, usertype: request.body.usertype };

    console.log(request.session.user);
    response.render("pages/auth/validation-success.njk");
  } catch (error) {
    console.error(error);
    if (!(error instanceof Error))
      throw new Error(`unknonw erorr(${error}) occured`);

    response.render("pages/auth/validation-error.njk", {
      reason: error.message,
    });
  }
});

function validatePhone(phone: string) {
  if (!phone.match(/^\+?[0-9()-]{7,20}$/))
    throw new Error("Invalid phone number fortmat");
}

function validateName(name: string) {
  if (name === "") throw new Error("Name not specified");
}

function validateEmail(email: string) {
  if (email === "") throw new Error("Email not specified");
  if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    throw new Error("Invalid email format");
}

function validatePassword(password: string, confirm: string) {
  if (password === "") throw new Error("Password not specified");
  if (confirm === "") throw new Error("Confirm Password not specified");
  if (password.length < 8) throw new Error("Password to short");
  if (password !== confirm) throw new Error("Passwords do not match");
}
