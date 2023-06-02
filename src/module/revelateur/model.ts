import { model, Schema, Document } from "mongoose";
import { KiffModel } from "../kiffs/model";

export const DOCUMENT_NAME = "Revelateur";
export const COLLECTION_NAME = "revelateur";


export enum associationValue {
    SYNERGIE_FAMILY_LYON = "Synergie Family Lyon",
    SYNERGIE_FAMILY_MARSEILLE = "Synergie Family Marseille",
    MCES = "MCES",
    NES_AND_CITE = "Nes&Cite"
}

export enum KiffsValues {
    SPORT = "Sport",
    E_SPORT = "E-Sport",
    MASTERCLASS_Influence = "MasterClass Influence",
    EXPREESION_DE_SOI = "Expression de soi",
}


export enum statusValues {
    PRESENT = "Present",
    ABSENT = "Absent"
}


export default interface Revelateur extends Document {
    lastName: string;//required
    firstName: string;//required
    email: string;//required
    phoneNumber: number;//required
    registeredEvents: string;
    associationName: string; //required
    kiffs: string;
    photo: string;
    talents: string;
    appointments: string;
    comments: string;
    reports: string;
    status: string;
    password: string;
    isVerified: boolean
    forgetConfirmationCode: string;
    forgetConfirmationCodeExpires: number;
    role: string;


}

const schema = new Schema(
    {
        lastName: {
            type: Schema.Types.String,
            required: true,
        },
        firstName: {
            type: Schema.Types.String,
            required: true,
        },
        email: {

            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: Schema.Types.Number,
            required: true,
        },
        registeredEvents: {
            type: Schema.Types.String,
            default: null
        },
        associationName: {
            type: Schema.Types.String,
            default: associationValue.MCES,
            // default: 'Synergie Family Marseille',
            required: false,

            // enum: [associationValue.MCES, associationValue.NES_AND_CITE, associationValue.SYNERGIE_FAMILY_LYON, associationValue.SYNERGIE_FAMILY_MARSEILLE]
        },
        kiffs: [{
            type: Schema.Types.String,
            trim: true,
            ref: KiffModel.modelName,
            default: null
            // enum:[ "Sport", "E-sport", "Masterclass Influence", "Expression de soi" ],
            // default:KiffsValues.EXPREESION_DE_SOI,
          }],
        photo: {
            type: Schema.Types.String,
            default: null
        },
        talents: {
            type: Schema.Types.String,
            default: null
        },
        appointments: {
            type: Schema.Types.String,
            default: null
        },
        comments: {
            type: Schema.Types.String,
            default: null
        },
        reports: {
            type: Schema.Types.String,
            default: null
        },
        status: {
            type: Schema.Types.String,
            default: statusValues.PRESENT,
            // enum: [statusValues.PRESENT, statusValues.ABSENT]
        },
        password: {
            type: Schema.Types.String,
            required: true
        },
        isVerified: {
            type: Schema.Types.Boolean,
            default: true
        },
        forgetConfirmationCode: {
            type: String,

            default: false

        },
        forgetConfirmationCodeExpires: {
            type: Date,
            default: new Date
        },
        role: {
            type: Schema.Types.String,
            default: "revelateur"
        }
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

export const RevelateurModel = model<Revelateur>(DOCUMENT_NAME, schema, COLLECTION_NAME);
