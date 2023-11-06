import { Schema, model } from "mongoose";


const userSchema = new Schema ({
    _id: String,
    name: String,
    email: String,
    password: String,
    // movies: []

})

export const userModel = model('user', userSchema)