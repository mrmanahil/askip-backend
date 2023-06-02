import { createLogger } from "winston";
import config from "../config/winston";

export const serverLogger = createLogger(config("Server"));

export const dbLogger = createLogger(config("Database"));
export const usersLogger = createLogger(config("User"));
export const adminsLogger = createLogger(config("Admin"));
export const revelateurLogger = createLogger(config("Revelateur"));
export const kiffsLogger = createLogger(config("Kiffs"));
export const eventsLogger = createLogger(config("Events"));
// export const validatorLogger = createLogger(config("Validator"));