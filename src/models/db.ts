import chalk from "chalk";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log(chalk.green("[sequelize]"), "connection established");
} catch (error) {
  if (!(error instanceof Error)) throw new Error(`unknown error ${error}`);
  console.error(chalk.red("[sequelize]"), chalk.red(error.message));
}

export { sequelize };
