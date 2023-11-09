import { Request, Response } from "express";
import { genreModel } from "../models/genre";

export const getAllGenres = async (req: Request, res: Response) => {

    try {
        const genres = await genreModel.find()

        res.status(200).json(genres)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getGenre = async (req: Request, res: Response) => {
    const { params: { genreId } } = req;

    try {
        const genre = await genreModel.findById({_id: genreId})

        res.status(200).json(genre)
    } catch (error) {
        res.status(500).json(error)
    }

}

export const createGenre = async (req: Request, res: Response) => {
    const { name } = req.body

    try {
        if(!name) throw new Error ('Missing field')
        
        const newGenre = await genreModel.create({name})

        res.status(201).json(newGenre)

    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteGenre = async (req: Request, res: Response) => {
    const { params: { genreId } } = req;

    try {
        if (!genreId) {
            return res.status(400).send('Genre ID is required');
        }
        
        const deletedGenre = await genreModel.findByIdAndDelete(genreId)

        if (!deletedGenre){
            return res.status(404).send('Genre not found')
        }

        res.status(200).json({ message: 'Genre deleted successfully', deletedGenre})

    } catch (error) {
        res.status(500).json(error)
    }    
}

export const updateGenre = async (req: Request, res: Response) => {
    const { genreId } = req.params;
    const { name } = req.body;

    try {
        const genre = await genreModel.findByIdAndUpdate(
            {_id: genreId},
            {$set: { name: name}},
            {new: true}
        )
        res.status(201).json(genre)
    } catch (error) {
        res.status(500).json(error)       
    }
}