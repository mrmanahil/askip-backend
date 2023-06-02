import * as express from "express";
import {

  successHandler,
  badRequestHandler,

} from "../../utils/responseHandler";


import * as generator  from 'generate-password'


import { SecretKeyModel } from "./model";


export const createSecretKey = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => { 
   
    console.log("user", req.body);
    try {

      const key = generator.generate({
        length: 20,
        numbers: true
      });

const secretKeyLengthObject=await SecretKeyModel.find().count()
console.log("secretKeyLengthObject", secretKeyLengthObject)
if(secretKeyLengthObject == 0 || secretKeyLengthObject == null ){
  const creteSecretKey= new SecretKeyModel()
  creteSecretKey.secretKey=key
 await creteSecretKey.save();
  return successHandler(res, creteSecretKey, "secret key created");
}
else{
  if(req.body.id){
  const updatKey =  await SecretKeyModel.findOneAndUpdate({ _id: req.body.id },
    {
   secretKey:key 
    },{new:true}); 
// if()
    return successHandler(res, updatKey, "secretKey has been changed");
  }
  else{
    return badRequestHandler(res, "bad request");
  }

}


      
    }
    catch (err) {
      
    }
  };