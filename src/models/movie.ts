import { Schema, model } from "mongoose";


const movieSchema = new Schema ({
    _id: String,
    name: String,
    poster_img: URL,
    score: Number,
    genre: String

})

const movieModel = model('movie', movieSchema)