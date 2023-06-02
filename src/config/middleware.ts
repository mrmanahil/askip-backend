import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

import passportConfig from "./passport";

export default (app: Application): void => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }
  app.use(cors());
  passport.use(passportConfig);
  app.use(passport.initialize());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
