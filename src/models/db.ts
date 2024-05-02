import chalk from "chalk";
import { Sequelize } from "sequelize";


const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

await sequelize
  .authenticate()
  .then(() => console.log(chalk.green("[sequelize]"), "connection established"))
  .catch((err) =>
    console.error(chalk.red("[sequelize]"), chalk.red(err.message)),
  );

export { sequelize };
