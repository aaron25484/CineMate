import { Document, Schema, model } from "mongoose";

interface IUserDocument extends Document {
    name: string,
    email:string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date
}

const userSchema = new Schema<IUserDocument> ({
    name: {
        type: String,
        required: [true, 'Name is require']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
}, {timestamps: true, versionKey: false})

export const userModel = model<IUserDocument>('user', userSchema)