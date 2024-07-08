import chalk from "chalk";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./dtms.db",
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log(chalk.green("[sequelize]"), "connection established");  
} catch (error) {
  if (!(error instanceof Error)) throw new Error(`unknown error ${error}`);
  console.error(chalk.red("[sequelize]"), error.name);
  throw error;
}

export { sequelize };
