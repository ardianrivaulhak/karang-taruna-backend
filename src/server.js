import path from "path";
import express from "express";
import configs from "./configs/index";
import routes from "./routes/index";
import cors from "cors";
import morgan from "morgan";
import Messaging from "./services/Messaging";
// import seedData from "./seeder";

global.__dirname = path.resolve("./");

const app = express();
const { name, host, port, uriPrefix } = configs.app;

app.use(express.json()); // for parsing application/json
app.use(cors());
Messaging.initialize();

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan("dev"));
app.use(uriPrefix, routes);
app.use("/storage", express.static("./storage"));
app.use(express.static("./public"));
// app.use(seedData());
app.listen({ host, port });

console.log(`${name} is listening on ${host}:${port}${uriPrefix}`);
