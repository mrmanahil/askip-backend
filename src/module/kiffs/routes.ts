import { Router } from "express";
import * as KiffController from "./controller";

export const Kiff = Router();


Kiff.post(
    "/kiff",
    // validator(rules.register, ValidationSource.BODY),
    KiffController.postKiff
  );
  Kiff.get(
    "/kiff",
    // validator(rules.register, ValidationSource.BODY),
    KiffController.getKiff
  );
  