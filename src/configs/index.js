import { config } from "dotenv";
config({ override: true });
import { envParams } from "../utils/getEnv.js";
export default {
  app: {
    env: envParams("APP_ENV") || "local",
    name: envParams("APP_NAME") || "RESTfull API with Express.js Framework",
    locale: envParams("LOCALE") || "en",
    host: envParams("HOST") || "0.0.0.0",
    port: envParams("PORT") || 3333,
    uriPrefix: envParams("URI_PREFIX") || "/api/",
    merchantName: envParams("MERCHANT_NAME") || "Denger-ind",
  },
  database: {
    dialect: envParams("DB_DIALECT"),
    host: envParams("DB_HOST"),
    port: envParams("DB_PORT"),
    database: envParams("DB_NAME"),
    username: envParams("DB_USER"),
    password: envParams("DB_PASSWORD"),
  },
  service: {
    apiGatewayUrl: envParams("API_GATEWAY_URL"),
    whapiKey: envParams("WHAPI_KEY"),
    nodemailerHost: envParams("NODEMAILER_HOST"),
    nodemailerPort: envParams("NODEMAILER_PORT"),
  },
  auth: {
    key: envParams("AUTH_SECRET_KEY"),
  },
  whapi: {
    key: envParams("WHAPI_URL"),
  },
  nodemailer: {
    user: envParams("NODEMAILER_USER"),
    pass: envParams("NODEMAILER_PASS"),
  },
};
