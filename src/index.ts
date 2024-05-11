import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import chalk from "chalk";
import "dotenv/config";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import express from "express";
import nunjucks from "nunjucks";
import * as session from "express-session";
import MySQLStore from "express-mysql-session";

import { router as home } from "./routes/router-home.js";
import { router as catalog } from "./routes/router-catalog.js";
import { router as tailors } from "./routes/router-tailors.js";
import { router as contact } from "./routes/router-contact.js";
import { router as auth } from "./routes/router-auth.js";

const PORT = process.env.PORT || 8080;
const DIRECTORY = dirname(fileURLToPath(import.meta.url));

const app = express()
  .use(cors())
  .use(helmet())
  .use(
    morgan("dev", {
      skip: ({ query: q, method: m }, { statusCode: sc }) => {
        return !Object.keys(q).length && 200 <= sc && sc < 400 && m === "GET";
      },
    }),
  )
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(resolve(DIRECTORY, "./public")))
  .use(
    session.default({
      resave: false,
      saveUninitialized: false,
      name: process.env.SESSION_NAME || "default",
      secret: process.env.SESSION_SECRET?.split(",") || "default-secret",
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: true,
        maxAge: 60 * 60 * 1000,
      },
      store: new (MySQLStore(session))({
        createDatabaseTable: true,
        database: process.env.DB,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
      }),
    }),
  );

app.listen(PORT, () => {
  console.log(
    chalk.green("[dtms-server]"),
    `running on port`,
    chalk.greenBright(`${PORT}`),
  );
});

nunjucks
  .configure(resolve(DIRECTORY, "./views"), {
    express: app,
    autoescape: true,
  })
  .addFilter("formatPrice", (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  })
  .addFilter(
    "ifIn",
    <T>(xs: undefined | string | string[], x: string, y: T): T | null => {
      if (xs === undefined) return null;
      else if (typeof xs === "string") return xs === x ? y : null;
      else return xs.includes(x) ? y : null;
    },
  )
  .addFilter("min", Math.min)
  .addFilter("ceil", Math.ceil)
  .addFilter("floor", Math.floor)
  .addFilter(
    "truncateText",
    (text: string, end: string, limit: number): string => {
      if (text.length <= limit) return text;
      return text.slice(0, limit - end.length) + end;
    },
  )
  .addFilter("dehyphenateAndCapitalize", (xs: string): string => {
    return xs
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  });

app.get("/", (_, response) => response.redirect("/home"));
app.use("/home", home);
app.use("/catalog", catalog);
app.use("/tailors", tailors);
app.use("/contact", contact);
app.use("/auth", auth);
