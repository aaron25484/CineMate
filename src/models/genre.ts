import { Schema, model } from "mongoose";

const genreSchema = new Schema ({
    _id: String,
    name: String
})

export const genreModel = model('genre', genreSchema)