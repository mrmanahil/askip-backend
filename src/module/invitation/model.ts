import { model, Schema } from "mongoose";
import { AdminModel } from "../adminAuth";
import { EventModel } from "../events/model";
import { RevelateurModel } from "../revelateur/model";
import { UserModel } from "../userAuth";


export const DOCUMENT_NAME = "Invitation"
export const COLLECTION_NAME = "invitations"



export default interface Invitation extends Document {

    userId: string;
    eventId: string;
    adminId: string;
    revelaturId: string;
    sendBy: string;
    status: string;
    role: string;
}

const schema = new Schema(
    {


        userId: {
            type: Schema.Types.String,
            ref: UserModel.modelName,
            default: null
        },
        eventId: {
            type: Schema.Types.String,
            ref: EventModel.modelName,
            default: null
        },
        adminId: {
            type: Schema.Types.String,
            ref: AdminModel.modelName,
            default: null
        },
        revelaturId: {
            type: Schema.Types.String,
            ref: RevelateurModel.modelName,
            default: null
        },
        sendBy: {
            type: Schema.Types.String,
        },
        status: {
            type: Schema.Types.String,
            // enum: ['pending', 'declined', 'accepted'],
            default: 'pending'

        },
        role: {
            type: Schema.Types.String,
            default: 'Admin',
            enum: ['Admin', 'revelateur'],
            required: true
        },
    },

    {
        timestamps: true,
        versionKey: false,
    }
);


export const InvitationModel = model<Invitation>(DOCUMENT_NAME, schema, COLLECTION_NAME);