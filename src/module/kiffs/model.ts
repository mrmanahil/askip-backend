import { model, Schema, Document } from "mongoose";


export const DOCUMENT_NAME = "Kiff";
export const COLLECTION_NAME = "kiffs";

export default interface kiff extends Document {
    name: string;
    url: string;

  }
  
  const schema = new Schema(
    {
    
  name:{
    type: Schema.Types.String,
    unique:true,
    default:false,
  },
  url:{
    type: Schema.Types.String,
    default:false,
  }
    },
  
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  export const KiffModel = model<kiff>(DOCUMENT_NAME, schema, COLLECTION_NAME);