import * as express from 'express';
import mongoose from 'mongoose';

import * as fs from 'fs';
import  XLSX from 'xlsx'
import { EmployeeModel } from './model';
import { serverErrorHandler, successHandler } from '../../utils/responseHandler';


export const importExcelData = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
   const xlFile =XLSX.readFile("C:\\Users\\farhan.ali\\Desktop\\dataToSave.xlsx")
   const sheet=xlFile.Sheets[xlFile.SheetNames[0]]
   const p_json =XLSX.utils.sheet_to_json(sheet)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   await EmployeeModel.insertMany(p_json).then((result:any)=>{
    if(result.length > 0){
        // res.send({status:200,message:"success",Count:result.length})
        return successHandler(res, {Count:result.length}, 'migrtion sucessfully');
    }
   })
    } catch (err) {
        return serverErrorHandler(res, err);
    }
  };