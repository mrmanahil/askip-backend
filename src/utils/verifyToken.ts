import * as jwt from "jsonwebtoken";

export const verifyToken = (payload: string): string | unknown =>
  jwt.verify(payload, process.env.JWTKEY as string);