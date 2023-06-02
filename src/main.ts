
import { Server, createServer } from "http";
import { config } from "dotenv";
import app from "./app";
import db from "./config/db";
config()
const server: Server = createServer(app);
const port = Number(process.env.PORT || 9000);

db()
  .then(() => {
    server.listen(port, () => {
      // serverLogger.info("Express server started on port: " + port);
      console.log("Express server started on port: " + port)
    });
  })
  .catch((err) => {
    // dbLogger.error("Connection error: " + err);
    console.log("error", err)
  });