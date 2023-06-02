import { model, Schema, Document } from "mongoose";
import { KiffModel } from "../kiffs/model";

export const DOCUMENT_NAME = "Admin";
export const COLLECTION_NAME = "admins";


export enum otpValues {
  PHONE = "phone",
  Email = "Email"
}


export enum KiffsValues {
  SPORT = "Sport",
  E_SPORT = "E-Sport",
  MASTERCLASS_Influence = "MasterClass Influence",
  EXPREESION_DE_SOI = "Expression de soi",
}

export enum locationValues {
  LYON = "Lyon",
  MARESEILLE = "Marseille"
}

export enum statusValues {
  PRESENT = "Present",
  ABSENT = "Absent"
}

export enum associationValue {
  SYNERGIE_FAMILY_LYON = "Synergie Family Lyon",
  SYNERGIE_FAMILY_MARSEILLE = "Synergie Family Marseille",
  MCES = "MCES",
  NES_AND_CITE = "Nes&Cite"
}

export default interface Admin extends Document {
  _id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  associationName: string,
  kiffs: string,
  photo: string,
  affiliatedRevelateurs: string,
  eventsCreated: string,
  talents: string,
  appointments: string,

  forgetConfirmationCode: string;
  forgetConfirmationCodeExpires: number;

  comments: string,
  reports: string,
  status: string,
  otpCode: string;
  isVerified: boolean;
  otpCodeExpires: number;
  role: string,
}

const schema = new Schema(
  {

    organization: {
      type: Schema.Types.String,
      default: null
    },
    status: {
      type: Schema.Types.String,
      default: statusValues.ABSENT
    },
    reports: {
      type: Schema.Types.String,
      default: null
    },
    comments: {
      type: Schema.Types.String,
      default: null
    },
    appointments: {
      type: Schema.Types.String,
      default: null
    },
    talents: {
      type: Schema.Types.String,
      default: null
    },
    eventsCreated: {
      type: Schema.Types.String,
      default: null
    },
    affiliatedRevelateurs: {
      type: Schema.Types.String,
      default: null
    },
    photo: {
      type: Schema.Types.String,
      default: null
    },
    kiffs: [{
      type: Schema.Types.String,
      trim: true,
      ref: KiffModel.modelName,
      default: null
      // enum:[ "Sport", "E-sport", "Masterclass Influence", "Expression de soi" ],
      // default:KiffsValues.EXPREESION_DE_SOI,
    }],
    associationName: {
      type: Schema.Types.String,
      required: true,
      default: "Nes&Cite",

    },
    firstName: {
      type: Schema.Types.String,
      required: true,
      trim: true,

    },
    lastName: {
      type: Schema.Types.String,
      required: true,
      trim: true,

    },
    phone: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      trim: true,
      select: false,
      required: true,
    },
    registeredEventsIds: [
      {
        type: Schema.Types.String,
        default: null
      },],
    forgetConfirmationCode: {
      type: String,

      default: false

    },
    forgetConfirmationCodeExpires: {
      type: Date,
      default: new Date
    },
    otpCode: {
      type: Schema.Types.String,
      trim: true,
      select: false,
      required: true,
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: true
    },
    otpCodeExpires: {
      type: Date,
      default: new Date
    },
    role: {
      type: Schema.Types.String,
      default: "Admin",
      required: false
    }
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const AdminModel = model<Admin>(DOCUMENT_NAME, schema, COLLECTION_NAME);
