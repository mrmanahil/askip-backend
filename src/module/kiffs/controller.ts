import * as express from "express";
import {
  serverErrorHandler,
  successHandler,
  badRequestHandler,

  //   usersLogger,
  //   hashPassword,
  //   createToken,
  //   RefreshToken,

} from "../../utils/responseHandler";

import { KiffModel } from "./model";



export const getKiff= async (
    req: express.Request,
    res: express.Response
  ): Promise<void> =>{
    try{
        const kiffData =await KiffModel.find()

        if(!kiffData)
        {
            return badRequestHandler(res, "data is not found");
        }
        else{
            
            return successHandler(res, { kiffData, success: true }, "Kiff Successfully created");
        }
    }
    catch(err)
    {
        return serverErrorHandler(res, err);
    }
  }

  export const postKiff= async (
    req: express.Request,
    res: express.Response
  ): Promise<void> =>{
    try{
        const kiffData =await KiffModel.findOne({name:req.body.name})

        if(kiffData)
        {
            return badRequestHandler(res, "kiff value already");
        }
        else{
            const createKiff =new KiffModel()
            createKiff.name=req.body.name
            createKiff.url=req.body.url
            await createKiff.save()
            return successHandler(res, {  success: true }, "Kiff Successfully created");
        }
    }
    catch(err)
    {
        return serverErrorHandler(res, err);
    }
  }