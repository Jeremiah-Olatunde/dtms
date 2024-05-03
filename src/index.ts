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

const PORT = process.env.PORT || 8080;
const DIRECTORY = dirname(fileURLToPath(import.meta.url));

const app = express()
  .use(cors())
  .use(helmet())
  .use(morgan("dev"))
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
  .addFilter("limit", (x: string, max: number): string => {
    return x.split("").slice(0, max).join("");
  });

app.get("/", (_, response) => response.redirect("/home"));
app.use("/home", home);
app.use("/catalog", catalog);
app.use("/tailors", tailors);
