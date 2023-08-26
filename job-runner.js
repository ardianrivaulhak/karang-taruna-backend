import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const [caller, cronScript, scriptName] = process.argv;

if (process.argv.length <= 2) {
  console.log("There's no parameter");
}
const fileLocation = `./src/jobs/${scriptName}.js`;
if (
  fs.existsSync(path.normalize(fileLocation)) ||
  fs.existsSync(path.normalize(fileLocation + ".js"))
) {
  import(fileLocation);
} else {
  const message = `Cannot find ${fileLocation} and ${fileLocation}.js`;
  console.log(message);
}
