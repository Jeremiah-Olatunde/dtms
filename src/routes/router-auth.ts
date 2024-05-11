import { Router } from "express";

import { SOCIALS, Socials } from "../models/model-user-tailor.js";
import { MEASUREMENTS, Measurements } from "../models/model-user-client.js";

import * as L from "../controllers/controller-login.js";
import * as T from "../controllers/controller-tailor.js";
import * as C from "../controllers/controller-client.js";

export const router = Router();

router.get("/login", (_, response) => {
  response.render("view-auth-login.njk");
});

router.post('/login', async (request, response) => {
  console.log("logging in");

  try {
    const { uid, usertype } = await L.login(
      request.body.email,
      request.body.password,
    );

    request.session.user = { uid, usertype };
    response.render("view-auth-validation-success.njk");
  } catch (error) {
    if (!(error instanceof Error))
      throw new Error(`unknown error${error}`);

    response.render("view-auth-validation-error.njk", { reason: error.message });
  }
});

router.get("/signup", (_, response) => {
  response.render("view-auth-signup.njk", { MEASUREMENTS, SOCIALS });
});

router.post("/signup", async (request, response) => {
  console.log(request.body);

  const form = request.body;

  try {
    if (form.usertype === "default")
      throw new Error("Account type not specified");

    validatePhone(form.phone);
    validateEmail(form.email);
    validateName(form.lastName);
    validateName(form.firstName);
    validatePassword(form.password, form.confirm);

    const uid = await L.create({
      email: form.email,
      password: form.password,
      usertype: form.usertype,
    });

    if(form.usertype === "tailor") {
      await T.create({
        uid: uid as string, 
        email: form.email as string, 
        phone: form.phone as string, 
        address: form.address as string,
        lastName: form.lastName as string, 
        firstName: form.firstName as string, 
        socials: {
          facebook: form.socials.facebook as string ?? null,
          instagram: form.socials.instagram as string ?? null,
          linkedin: form.socials.linkedin as string ?? null,
          twitter: form.socials.twitter as string ?? null,
        },
      })
    } else {
      await C.create({
        uid: uid as string, 
        email: form.email as string, 
        phone: form.phone as string, 
        gender: form.gender as "male" | "female",
        address: form.address as string,
        lastName: form.lastName as string, 
        firstName: form.firstName as string, 
        measurements: Object.fromEntries(
          Array.from(Object.entries(form.measurements)).map(([key, value]) => {
            if(!(value as string).match(/^-?\d+(\.\d+)?$/))
              throw new Error(`Invalid measurment ${key} specified`);
            return [key, value === "" ? null : value]
          })
        ),
      })
    }


    request.session.user = { uid, usertype: request.body.usertype };

    console.log(request.session.user);
    response.render("view-auth-validation-success.njk");
  } catch (error) {
    if (!(error instanceof Error))
      throw new Error(`unknonw erorr(${error}) occured`);

    response.render("view-auth-validation-error.njk", {
      reason: error.message,
    });
  }
});

function validatePhone(phone: string){
  if(!phone.match(/^\+?[0-9()-]{7,20}$/))
    throw new Error("Invalid phone number fortmat")
}

function validateName(name: string){
  if(name === "") throw new Error("Name not specified");
}

function validateEmail(email: string){
  if(email === "") throw new Error("Email not specified");
  if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    throw new Error("Invalid email format");
}

function validatePassword(password: string, confirm: string){
  if (password === "") throw new Error("Password not specified");
  if (confirm === "") throw new Error("Confirm Password not specified");
  if (password !== confirm) throw new Error("Passwords do not match");
  if(password.length < 8) throw new Error("Password to short");
}