import { Schema, model } from "mongoose";


const movieSchema = new Schema ({
    _id: String,
    name: String,
    poster_img: String,
    score: Number,
    genre: String

})

export const movieModel = model('movie', movieSchema)