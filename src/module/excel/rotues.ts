
import { Router } from "express";
import * as importExcel from "./controller";

export const excel = Router();

excel.post(
   "/excel",

   importExcel.importExcelData
 );