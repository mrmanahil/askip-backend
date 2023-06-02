import * as jwt from "jsonwebtoken";

export const createToken = (payload: string): string =>
  jwt.sign({payload:payload}, process.env.JWTKEY as string,{

    expiresIn: '120s' 

});
export const RefreshToken = (payload: string): string =>
  jwt.sign({payload:payload}, process.env.REFRESHJWT as string,{

    expiresIn: '120s' 

});
