import { model, Schema, Document } from "mongoose";
import { AdminModel } from "../adminAuth/model";
import { RevelateurModel } from "../revelateur/model";


export const DOCUMENT_NAME = "Event";
export const COLLECTION_NAME = "events";


// export enum OrderStatus {
//     PENDING = "pending",
//     RECEIVED = "received",
//     ARRIVED = "arrived",
//     COMPLETED = "completed",
//   }
export enum participationTypeValues {
  // ["En distanciel", "En présentiel"],
  EnDistanciel = "En distanciel",
  EnPrésentiel = "En présentiel"

}


export enum choicePlatfromValues {
  PC = "PC",
  XboxOne = "Xbox One",
  XboxSeriesX = "Xbox Series X",
  PS4 = "PS4",
  PS5 = "PS5",
  Switch = "Switch",
  Portable = "Portable"
}
// [ "PC", "Xbox One", "Xbox Series X", "PS4", "PS5", "Switch", "Portable" ]


export default interface Event extends Document {
  eventIdAttence:string;
  eventName: string;
  eventImage: string;
  postalAddress: string;
  zipCode: string;
  description: string;
  beginAt: Date;
  endAt: Date;
  startTime: string;
  endTime: string;
  mandatoryRegistration: boolean;
  participationType: string,
  mandatoryRegistrationOnline: boolean,
  mandatoryRegistrationOnSite: boolean,
  minNumberParticipantsOnSite: number;
  maxNumberParticipantsOnSite: number;
  minNumberParticipantsOnline: number;
  maxNumberParticipantsOnline: number;
  maxNumberParticipants: number,
  numberOfRevelateurs: number,
  choicePlatfrom: string,
  price: number,
  category: string,
  subscriptionIds: [],
  subsribtionMinor: [],
  subsIdAdminAndRevelature: [],
  subsIdAdmin: [],
  subsIdRevelature: [],
  s_id: string,
  role: string,
  city: string,
  organizerId: string,
  organizerBy: string,
  isPublished: boolean,
  status: string
}

const schema = new Schema(
  {
    eventIdAttence:{
      type: Schema.Types.String,
      default: null,
    },
    mandatoryRegistrationOnline: {
      type: Schema.Types.Boolean,
      default: null,
    },
    mandatoryRegistrationOnSite: {
      type: Schema.Types.Boolean,
      default: null,
    },

    city: {
      type: Schema.Types.String,
      default: null,

    },
    role: {
      type: Schema.Types.String,
      enum: ["Admin", "Revelature"],
      default: "Admin",
    },
    eventName: {
      type: Schema.Types.String,
      required: false,
      default: null


    },
    eventImage: {
      type: Schema.Types.String,
      required: false,
      default: null

    },
    subsIdAdminAndRevelature: [
      {
        type: Schema.Types.String,
        ref: RevelateurModel.modelName,
        default: null,
      }
    ],
    postalAddress: {
      type: Schema.Types.String,
      default: null,
      required: false


    },
    zipCode: {
      type: Schema.Types.String,
      default: null,
      required: false,
    },
    description: {
      type: Schema.Types.String,
      default: null,
      required: false,
    },
    beginAt: {
      type: Schema.Types.Date,
      default: new Date(),
      required: false,

    },
    endAt: {
      type: Schema.Types.String,
      default: new Date(),
      required: false,


    },
    startTime: {
      type: Schema.Types.String,
      // default:new Date,
      required: false,


    },
    endTime: {
      type: Schema.Types.String,
      // default:new Date(),
      required: false,

    },

    // mandatoryRegistration: {
    //   type: Boolean,
    //   default: false,
    //   required: false,

    // },

    // onsitePr
    // onlineDis
    participationType: [{
      type: Schema.Types.Array,
      enum: ["En distanciel", "En présentiel"],
      default: participationTypeValues.EnDistanciel,
      required: false,
    }],
    maxNumberParticipantsOnSite: {
      type: Schema.Types.Number,
      required: false,
      trim: false,

    },
    minNumberParticipantsOnSite: {
      type: Schema.Types.Number,
      required: false,
      trim: true,

    },
    minNumberParticipantsOnline: {
      type: Schema.Types.Number,
    },
    maxNumberParticipantsOnline: {
      type: Schema.Types.Number,
    },
    numberOfRevelateurs: {
      type: Schema.Types.Number,
      required: false,
      trim: true,

    },
    choicePlatfrom: [{
      type: Schema.Types.Array,
      enum: ["PC", "Xbox One", "Xbox Series X", "PS4", "PS5", "Switch", "Portable"],
      default: choicePlatfromValues.PC,
      required: false,
      trim: true,

    }],
    price: {
      type: Schema.Types.Number,
      required: false,
      trim: true,

    },
    category: {
      type: Schema.Types.String,
      required: false,
      trim: true,

    },
    subscriptionIds: [
      {
        type: Schema.Types.String,
        default: null
      },

    ],
    subsribtionMinor: [
      {
        type: Schema.Types.String,
        default: null
      },

    ],
    organizerId: {
      type: Schema.Types.String,

      trim: true,
      ref: AdminModel.modelName,
      default: null
      // enum:[ "Sport", "E-sport", "Masterclass Influence", "Expression de soi" ],
      // default:KiffsValues.EXPREESION_DE_SOI,
    },
    organizerBy: {
      type: Schema.Types.String,
      enum: ["Admin", "Revelature"],
      default: "Admin",
      required: false,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false
    },
    maxNumberParticipants: {
      type: Schema.Types.Number,
      default: 0
    },
    status: {
      type: Schema.Types.String,
      enum:['published','draft','reported','cancelled','finished'],
      
      default: 'published'
    }

  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const EventModel = model<Event>(DOCUMENT_NAME, schema, COLLECTION_NAME);
