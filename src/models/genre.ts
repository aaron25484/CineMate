import { Schema, model } from "mongoose";


const genreSchema = new Schema ({
    _id: String,
    name: String
})

const genreModel = model('genre', genreSchema)