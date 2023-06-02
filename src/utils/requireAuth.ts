import { Request, Response, NextFunction } from "express";
import passport from "passport";
import User from "../module/userAuth/model";
import Admin from "../module/adminAuth/model";

import { unauthorizedHandler, serverErrorHandler } from "./responseHandler";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: User) => {
    
    if (err) return serverErrorHandler(res, err);
    if (!user)
      return unauthorizedHandler(res, new Error("Invalid Token of User"));
    req.user = user;
    next();
  })(req, res);
};

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate("jwt", { session: false }, (err: Error, Admin: Admin) => {
   
    if (err) return serverErrorHandler(res, err);
    if (!Admin)
      return unauthorizedHandler(res, new Error("Invalid Token of Admin"));
    req.user = Admin;
    next();
  })(req, res);
};

