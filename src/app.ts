/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application } from "express";
import fireBaseadmin, { ServiceAccount } from 'firebase-admin'
import bodyParser from "body-parser";
import { authRoutes } from "./module/adminAuth";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userAuth } from "./module/userAuth/routes";
import { eventRoutes } from "./module/events/routes";
import middleware from "./config/middleware";
import { config } from "dotenv";
import { revelateurtRoutes } from "./module/revelateur/routes";
import { Kiff } from "./module/kiffs/routes";
import { invitationRoutes } from "./module/invitation";
import { secrtKeyRoute } from "./module/secretKey/routes";
import { attendenceRoutes } from "./module/attendence/routes";
import { appointments } from "./module/appointments/routes";
import { appointmentRequest } from "./module/appointmentRequest/routes";
import { appointmentReport } from "./module/appointmentReports/routes";
import { excel } from "./module/excel/rotues";

const app: Application = express();
config()

const key: any = process.env.PRIVATE_KEY
const adminConfig: ServiceAccount = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: key.replace(/\\n/g, '\n'),
};

fireBaseadmin.initializeApp({
  credential: fireBaseadmin.credential.cert(adminConfig),
  databaseURL: process.env.Database_Url as string
})
const server = app.listen();
server.setTimeout(5000000);


app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
middleware(app);

app.use(express.static(__dirname + '/public/'));
app.use("/upload", express.static("src/upload"));

app.use("/api/v1", [
  authRoutes,
  userAuth,
  eventRoutes,
  revelateurtRoutes,
  Kiff,
  invitationRoutes,
  secrtKeyRoute,
  attendenceRoutes,
  appointments,
  appointmentRequest,
  appointmentReport,
  excel
]);



app.use((err: any, res: any) => {
  console.log("err.message",err.message )
  res.status(500).send({ message: err.message || "Network Error" })
})


export default app;
