import { Document, Schema, model } from "mongoose"; 

interface IGenreDocument extends Document {
    name: string
}

const genreSchema = new Schema<IGenreDocument> ({
    name: {
        type: String,
        required: [true, 'Name is required']
    }
})

export const genreModel = model<IGenreDocument>('genre', genreSchema)