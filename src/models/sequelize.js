import { Sequelize } from "sequelize";
import configs from "../configs/index";

const { database } = configs;

export default new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: database.dialect,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      // acquire: 30000,
      // idle: 10000,
    },
  }
);
