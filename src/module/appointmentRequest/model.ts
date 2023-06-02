import { model, Schema } from "mongoose";
import { RevelateurModel } from "../revelateur/model";
import { UserModel } from "../userAuth";
// import { AdminModel } from "../adminAuth";




export const DOCUMENT_NAME = "AppointmentRequest"
export const COLLECTION_NAME = "appointmentRequests"



export default interface AppointmentRequest extends Document {
talentId:string,
revelateurId:string,
status:string,  
}



const schema = new Schema(
    {
  
        talentId:{
            type: Schema.Types.String,
            ref: UserModel.modelName,
            default: null
        },
        revelateurId:{
            type: Schema.Types.String,
            ref: RevelateurModel.modelName,
            default: null
        },

        status:{
            type: Schema.Types.String,
          enum:["pending","accepted","refused"],
            default: "pending"
        },

    },

    {
        timestamps: true,
        versionKey: false,
    }
);


export const AppointmentRequestModel = model<AppointmentRequest>(DOCUMENT_NAME, schema, COLLECTION_NAME);