import mongoose from "mongoose";
import { dbLogger } from "../utils/loggeer";
import dotenv from "dotenv";
dotenv.config();
const dbURI = process.env.MONGODB_URL as string;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 2000, //Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, //Close sockets after 45 seconds of inactivity
};

// dbLogger.info(dbURI);

// Create the database connection
export default async (): Promise<typeof mongoose> => {
  // When successfully connected
  mongoose.connection.on("connected", () => {
    // dbLogger.info("Mongoose default connection open to " + dbURI);
  });
 
  // If the connection throws an error
  mongoose.connection.on("error", (err) => {
    dbLogger.error("Mongoose default connection error: " + err);
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", () => {
    // dbLogger.info("Mongoose default connection disconnected");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      //   dbLogger.info(
      //     "Mongoose default connection disconnected through app termination"
      //   );
      process.exit(0);
    });
  });

  return mongoose.connect(dbURI, options);
};

