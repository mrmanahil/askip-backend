import { Router } from "express";
// import { ObjectSchema } from "joi";
// import { ValidationSource } from "../../utils/validators";
import validator, { ValidationSource } from "../../utils/validators";
import * as UserController from "./controller";
// import validator, { ValidationSource } from "../../utils/validators";
import rules from "./rules";


export const userAuth = Router();
userAuth.post(
  "/user/register",
  validator(rules.register, ValidationSource.BODY),
  UserController.registerUser
);

userAuth.post(
  "/user/login",
  UserController.loginUser
);

userAuth.get(
  "/user/:id",
  UserController.getUser
);

userAuth.put(
  "/user/:id",
  validator(rules.updateUser, ValidationSource.BODY),
  UserController.updateUser
);

userAuth.delete(
  "/user/:id",
  UserController.deleteUser
);

// userAuth.post(
//   "/user/verfiOtpuser",
//   UserController.verfiRegisterUserOtp
// );


// userAuth.post(
//   "/auth/verfiOtpuser",
//   UserController.verfiRegisterUserOtp
// );

userAuth.post(
  "/user/sendotp",
  UserController.forgetPasOtp
);


userAuth.post(
  "/user/verfi",
  UserController.verfiUserForgetOtp
);

userAuth.post(
  "/user/confirmpass",
  UserController.forgetPasOtpConfir 
);


userAuth.get(
  "/user/",
  UserController.forgetPasOtpConfir 
);

userAuth.post(
  "/user/consult",
  UserController.consultData
);

userAuth.post(
  "/user/emailcheck",
  UserController.emailCheck
);


userAuth.post(
  "/user/emaillink",
  UserController.emailLinkSend
);



userAuth.post(
  "/user/phonecheck",
  UserController.phoneCheck
);

userAuth.put(
  "/user/changepass/:id",
  UserController.changePassword
);

userAuth.get(
  "/user/checkingSteps/:id",
  UserController.checkingSteps
);


userAuth.get(
  "/allUsers",
  UserController.getUsers
);

userAuth.get(
  "/user/age/:id",
  UserController.checkingAge
);
userAuth.get(
  "/user/kiff/:id",
  UserController.checkKiff
);


userAuth.put(
  "/fcmTokenUpdate/:id",
  UserController.updateFcmToken
);