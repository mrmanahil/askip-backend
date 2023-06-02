import { model, Schema, Document } from "mongoose";


export const DOCUMENT_NAME = "Employee";
export const COLLECTION_NAME = "employees";




export default interface Employee extends Document {
length: number;
name:string,
age:string,
deignation:string
}

const schema = new Schema(
  {

 name:{
    type: Schema.Types.String,
 },
 age:{
    type: Schema.Types.String,
 },
 deignation:{
    type: Schema.Types.String,
 }
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const EmployeeModel = model<Employee>(DOCUMENT_NAME, schema, COLLECTION_NAME);
