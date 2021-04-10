import express from "express";
import dotenv from "dotenv";
import path from "path";
import start from "./start";
import configure from "./configure";
import fs from "fs";
// ...
dotenv.config({
  path: fs.existsSync(path.join(process.cwd(), ".env.local"))
    ? path.join(process.cwd(), ".env.local") // Not in source control
    : path.join(process.cwd(), ".env"),
});
/** */
(async function main() {
  const app = express();
  try {
    const server = await start(app);
    await configure(app);
    const { address, family, port } = server.address() as any;
    return `Express Listening on [${[address, family, port]}]`;
  } catch (error) {
    return Promise.reject(error);
  }
})()
  .then(console.log)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
