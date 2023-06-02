import { model, Schema } from "mongoose";

import { UserModel } from "../userAuth";
// import { AdminModel } from "../adminAuth";




export const DOCUMENT_NAME = "AppointmentReport"
export const COLLECTION_NAME = "appointmentReports"



export default interface AppointmentRequest extends Document {
talentId:string,
comment:string,
status:string,  
}



const schema = new Schema(
    {
  
        talentId:{
            type: Schema.Types.String,
            ref: UserModel.modelName,
            default: null
        },
        comment:{
            type: Schema.Types.String,
            
        },

        status:{
            type: Schema.Types.String,
            enum:["pending","draft","finished"],
            default: "pending"
        },

    },

    {
        timestamps: true,
        versionKey: false,
    }
);


export const AppointmentRequestModel = model<AppointmentRequest>(DOCUMENT_NAME, schema, COLLECTION_NAME);