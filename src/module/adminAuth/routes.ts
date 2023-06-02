import * as express from "express";
import { Router } from "express";
import * as AuthController from "./controller";
import validator, { ValidationSource } from "../../utils/validators";
import rules from "./rules";

import { upload } from "../../constant/multer"



export const authRoutes = Router();
authRoutes.post(
  "/admin/register",
  validator(rules.register, ValidationSource.BODY),
  AuthController.registerAdmin
);
authRoutes.post(
  "/admin/login",
  validator(rules.login, ValidationSource.BODY),
  AuthController.loginAdmin
);
authRoutes.post(
  "/admin/verfiotp",
  AuthController.verfiAdminForgetOtp
);
authRoutes.put(
  "/admin/:id",
  AuthController.updateAdmin
);
// const uploadMiddleware = upload.single('filePush');
// authRoutes.post(
//   "/uploadImage",
//   upload.single(),
//   AuthController.uploadSingleImage
// );


authRoutes.delete('/deleteImage/:path', AuthController.deleteImage)

authRoutes.get(
  "/admin/:id",
  AuthController.getAdmin
);
authRoutes.delete(
  "/admin/:id",
  AuthController.deleteAdmin
);

authRoutes.post(
  "/admin/sendOtp",
  AuthController.forgetPasOtp
);
authRoutes.post(
  "/admin/confirmotp",
  AuthController.forgetPasOtpConfir
);
authRoutes.put(
  "/admin/changepass/:id",
  AuthController.changePassword
);

authRoutes.post(
  "/admin/consult",
  AuthController.consultData
);

authRoutes.post(
  "/admin/emailLink",
  AuthController.emailLinkSend
);



authRoutes.get(
  "/admins/",
  AuthController.getAllAdmin
);



const uploadMiddleware = upload.single('filePush');

authRoutes.post('/uploadImage', (req: express.Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: express.Response,next:any) => {
  uploadMiddleware(req, res, err => {
    if (err) {
      return res.status(418).send("file maximum size 5mb");
  } else {
    next()
  
    }
  });
}, AuthController.uploadSingleImage);