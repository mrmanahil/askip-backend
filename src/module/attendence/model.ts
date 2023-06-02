import { model, Schema } from "mongoose";
// import { AdminModel } from "../adminAuth";

import { EventModel } from "../events/model";
import { UserModel } from "../userAuth";


export const DOCUMENT_NAME = "Attendence"
export const COLLECTION_NAME = "attendences"



export default interface Attendence extends Document {

    
    eventId: string;
    absent:[];
    present:[];
    status:string
   
}

const schema = new Schema(
    {


        eventId: {
            type: Schema.Types.String,
            ref: EventModel.modelName,
            default: null
        },
        absent: [{
            type: Schema.Types.String,
            ref: UserModel.modelName,
            default: null
        }],
        present:[{
            type: Schema.Types.String,
            ref: UserModel.modelName,
            default: null
        }],
     
         status:{
            type: Schema.Types.String,
            default: 'open',
            enum : ['open','closed'],
            required:true
        },
    },

    {
        timestamps: true,
        versionKey: false,
    }
);


export const AttendenceModel = model<Attendence>(DOCUMENT_NAME, schema, COLLECTION_NAME);