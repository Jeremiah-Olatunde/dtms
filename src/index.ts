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
    `[${chalk.dim(new Date().toTimeString().split(" ")[0])}]`,
    chalk.bgGreen("dtms-server"),
    chalk.green(`listening on port ${PORT}`),
  );
});

nunjucks.configure(resolve(DIRECTORY, "./views"), {
  express: app,
  autoescape: true,
});
