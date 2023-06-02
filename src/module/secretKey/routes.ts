
import { Router } from "express";

import * as secretKeyController from "./controller";


export const secrtKeyRoute = Router();



secrtKeyRoute.put(
    "/generateKey",
    secretKeyController.createSecretKey
  );