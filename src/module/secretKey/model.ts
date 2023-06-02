import { model, Schema, Document } from "mongoose";


export const DOCUMENT_NAME = "SecretKey";
export const COLLECTION_NAME = "secretkey";




export default interface SecretKey extends Document {
    secretKey: string;//required
  


}

const schema = new Schema(
    {
        secretKey: {
            type: Schema.Types.String,
            required: true,
        },
       
    },

    {
        timestamps: true,
        versionKey: false,
    }
);

export const SecretKeyModel = model<SecretKey>(DOCUMENT_NAME, schema, COLLECTION_NAME);