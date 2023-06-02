import { model, Schema } from "mongoose";
import { RevelateurModel } from "../revelateur/model";
import { UserModel } from "../userAuth";
// import { AdminModel } from "../adminAuth";




export const DOCUMENT_NAME = "Appointment"
export const COLLECTION_NAME = "appointments"



export default interface Appointment extends Document {
talent:string,
createdBy:string,
subject:string,
time:Date,
date:Date,
type: Date,
onlineLink:string,
postalAddress:string,
zipCode:string,
city:string,
additionallnfos:string,
attendancy:boolean,
appointmentReportId:string,
appointmentCancelId:string,
status:string,  
}



const schema = new Schema(
    {
  
        talent:{
            type: Schema.Types.String,
            ref: UserModel.modelName,
            default: null
        },
        createdBy:{
            type: Schema.Types.String,
            ref: RevelateurModel.modelName,
            default: null 
        },
        subject:{
            type: Schema.Types.String, 
        },
        time:{
            type: Schema.Types.Date, 
        },
        date:{
            type: Schema.Types.Date, 
        },
        type:{
            type: Schema.Types.String, 
            enum:["onSite","online"]
        },
        onlineLink:{
            type: Schema.Types.String, 
            default:null,
        },
        postalAddress:{
            type: Schema.Types.String, 
            default:null,
        },
        zipCode:{
            type: Schema.Types.String, 
            default:null,
        },
        city:{
            type: Schema.Types.String, 
            default:null,
        },
        additionallnfos:{
            type: Schema.Types.String, 
        },
        attendancy:{
            type: Schema.Types.Boolean, 
        },
        appointmentReportId:{
            type: Schema.Types.String, 
        },
        appointmentCancelId:{
            type: Schema.Types.String, 
        },
        status:{
            type: Schema.Types.String, 
            enum:["pending","cancelled","accepted"],
            default:"pending"
        },


    },

    {
        timestamps: true,
        versionKey: false,
    }
);


export const AppointmentModel = model<Appointment>(DOCUMENT_NAME, schema, COLLECTION_NAME);