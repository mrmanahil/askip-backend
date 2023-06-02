
import { model, Schema, Document } from "mongoose";
import { KiffModel } from "../kiffs/model";
import { RevelateurModel } from "../revelateur/model";


export const DOCUMENT_NAME = "User";
export const COLLECTION_NAME = "users";

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


export enum genderValue {
  UN_HOMME = "Un Homme",
  UNE_FEMME = "Une Femme",
  NON_PRECISE = "Non Precise",
  AUTRE = "Autre",
  IEL = "Iel",
  IL = "IL",
  ELLE = "Elle"
}


export enum registeredSpeValue {
  A_LA_MISSION_LOCALE = "Oui, à la mission locale",
  A_POLE_EMPLOI = "Oui, à pôle emploi",
  AUCUN = "Aucun",
}
export enum futurGoalValues {
  EMPLOI = "Emploi",
  ENERPRENARIAT = "Entreprenariat",
  REMISEDETUDES = "Remise d'études"
}

export enum needSupportValues {
  ALEMPLOI = "à l'emploi",
  ALACREATIONDENTREPRISE = "à la création d'entreprise",
  ALAREPRISEDEFORMATION = "à la reprise de formation"
}


export enum degreeLevel {
  BrevetDesColleges = "Brevet des collèges",
  CAP = "CAP",
  BACORPRO = "Bac/Bac pro",
  BTSORLICENCE = "BTS / Licence",
  MASTER = "Master",

}



export default interface User extends Document {

  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  otpCode: string;
  isVerified: boolean;
  otpCodeExpires: number;
  forgetConfirmationCode: string;
  forgetConfirmationCodeExpires: number;
  postalAddress: string;
  birthDate: Date;
  zipCode: string;
  city: string;
  location: string;
  kiffs: [];
  fcmToken: string;
  discordUserName: string;
  meetLocation: string;
  disabledWorker: boolean;
  relatedRevelateur: string;
  registeredSPE: string;
  needSupport: string;
  futurGoal: string;
  photo: string;
  identityCard: string;
  identityCardNumber: string;
  professionalSituation: string;
  degreeLevel: string;
  gender: string;
  instagramUserName: string;
  snapChatUserName: string;
  recommentEvent: string;
  appointments: string;
  qrCodesForEvent: string;
  EventsApplied: string;
  comments: string;
  role: string;
  semiGender: string;
  isApproved: boolean;
  progress:number;
  region:string,


}

const schema = new Schema(
  {

    location: {
      type: Schema.Types.String,
      // enum:[locationValues.LYON,locationValues.MARESEILLE],
      default: locationValues.LYON,


    },
    comments: {
      type: Schema.Types.String,
      default: null
    },
    EventsApplied: {
      type: Schema.Types.String,
      default: null
    },
    qrCodesForEvent: {
      type: Schema.Types.String,
      default: null
    },
    appointments: {
      type: Schema.Types.String,
      default: null
    },
    recommentEvent: {
      type: Schema.Types.String,
      default: null
    },
    snapChatUserName: {
      type: Schema.Types.String,
      default: null
    },
    instagramUserName: {
      type: Schema.Types.String,
      default: null
    },
    gender: {
      type: Schema.Types.String,
      // default: genderValue.AUTRE,
      default: null,
      // enum:[ "Un homme", "Une femme", "Non précisé", "Autre", "iel", "il", "Elle" ],
      required: false
    },
    degreeLevel: {
      type: Schema.Types.String,
      // enum:["Brevet des collèges","CAP","Bac/Bac pro","BTS / Licence","Master",],
      // default: degreeLevel.BACORPRO,
      default: null,
      reqiured: false,
    },
    professionalSituation: {
      type: Schema.Types.String,
      default: null,
      reqiured: false,
    },
    identityCardNumber: {
      type: Schema.Types.String,
      default: null
    },
    identityCard: {
      type: Schema.Types.String,
      default: null
    },
    photo: {
      type: Schema.Types.String,
      default: "/upload/user/1673511006484.jpg"
    },
    futurGoal: {
      type: Schema.Types.String,
      // enum: [ "Emploi", "Entreprenariat", "Remise d'études" ],
      default: null,
      required: false
    },
    needSupport: {
      type: Schema.Types.String,
      // default: needSupportValues.ALACREATIONDENTREPRISE,
      default: null,
      // enum:[ "à l'emploi", "à la création d'entreprise", "à la reprise de formation" ],
      required: false
    },
    registeredSPE: {
      type: Schema.Types.String,
      // default: registeredSpeValue.A_LA_MISSION_LOCALE,
      // enum:[ "Oui, à la mission locale", "Oui, à pôle emploi", "Aucun" ],
      default: null,
      required: false
    },
    relatedRevelateur: {
      type: Schema.Types.String,

      trim: true,
      ref: RevelateurModel.modelName,
      default: null

    },
    disabledWorker: {
      type: Schema.Types.String,
      required: false,
      default: null,
    },
    meetLocation: {
      type: Schema.Types.String,
      default: null
    },
    discordUserName: {
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
    city: {
      type: Schema.Types.String,
      default: null

    },
    zipCode: {
      type: Schema.Types.String,
      default: null,
      required: false,
    },
    birthDate: {
      type: Schema.Types.Date,
      default: null,

      required: false,
    },
    firstName: {
      type: Schema.Types.String,
      // required: true,
      trim: true,

    },
    lastName: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      default: null,
      // required: true,
      // unique: true,

    },
    phone: {
      type: Schema.Types.String,
      // required: true,
      unique: true,

    },
    // countryCode: {
    //   type: Schema.Types.String,
    //   trim: true,
    //   select: false,
    //   required: true,
    // },
    password: {
      type: Schema.Types.String,
      trim: true,
      select: false,
      // required: true,
    },
    forgetConfirmationCode: {
      type: Schema.Types.String,
      default: 0

    },
    forgetConfirmationCodeExpires: {
      type: Schema.Types.Date,
      default: new Date


    },
    otpCode: {
      type: Schema.Types.String,
      trim: true,
      select: false,

    },

    otpCodeExpires: {
      type: Schema.Types.Date,
      default: new Date
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: true
    },
    postalAddress: {
      type: Schema.Types.String,
      default: null
    },

    role: {
      type: Schema.Types.String,
      default: "User"
    },
    isApproved: {
      type: Schema.Types.Boolean,
      default: true
    },

    semiGender: {
      type: Schema.Types.String,
      default: null
    },
    fcmToken: {
      type: Schema.Types.String,
      default: null
    },
    progress:{
      type: Schema.Types.Number,
      default: 0.1 
    },
    region:{
      type: Schema.Types.String,
      default:null
    }
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
