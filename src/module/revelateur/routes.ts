import { Router } from "express";
import * as Revelateur from "./controller";




export const revelateurtRoutes = Router();

revelateurtRoutes.post(
  "/register/revelateur",
  Revelateur.registerRevelateur
);


revelateurtRoutes.post(
  "/login/revelateur",
  Revelateur.loginRevelateur
);


revelateurtRoutes.post(
  "/revelateur",
  Revelateur.createRevelateur
);

revelateurtRoutes.post(
  "/revelateur",
  Revelateur.createRevelateur
);



revelateurtRoutes.put(
  "/revelateur/:id",
  Revelateur.updateRevelateurById
);

revelateurtRoutes.get(
  "/revelateur/:id",
  Revelateur.getRevelateurById
);

revelateurtRoutes.get(
  "/revelateur",
  Revelateur.getRevelateur
);


revelateurtRoutes.delete(
  "/revelateur/:id",
  Revelateur.deleteRevelateurById
);

revelateurtRoutes.post(
  "/revelateur/forgetPasOtp",
  Revelateur.forgetPasOtp
);


revelateurtRoutes.post(
  "/revelateur/verfiOtp",
  Revelateur.verfiRevelaturForgetOtp
);

revelateurtRoutes.post(
  "/revelateur/forgetConfirm",
  Revelateur.forgetPasOtpConfir
);


revelateurtRoutes .put(
  "/revelateur/changepass/:id",
  Revelateur.changePassword
);


revelateurtRoutes.post(
  "/revelateur/consult",
  Revelateur.consultData
);


revelateurtRoutes.post(
  "/revelateur/emailLink",
  Revelateur.emailLinkSend
);
