import { Request, Response } from "express";
import { genreModel } from "../models/genre";

export const getAllGenres = (req: Request, res: Response) => {
    genreModel.find().then((data) => res.json(data)).catch((error) => res.json({message:'wronggg'}))

}

export const getGenre = (req: Request, res: Response) => {
    const { params: { genreId } } = req;

    genreModel.findById(genreId).then((user) => res.json(user))
}

export const createGenre = (req: Request, res: Response) => {
    const genre = new genreModel(req.body)
    genre.save().then((data) => res.json(data)).catch((error) => res.json({message:'wronggg'}))
    // res.status(200).send('User created succesfully')
}

export const deleteGenre = (req: Request, res: Response) => {
    const { params: { genreId } } = req;

    if (!genreId) {
        return res.status(400).send('Genre ID is required');
    }

    genreModel
        .findByIdAndDelete(genreId)
        .then((deletedGenre) => {
            if (!deletedGenre) {
                return res.status(404).send('Genre not found');
            }
            res.status(200).json({ message: 'Genre deleted successfully', deletedGenre });
        })
};

export const updateGenre = (req: Request, res: Response) => {
    const { params: { genreId }, body } = req;

    genreModel.findByIdAndUpdate(genreId, body, { new: true })
        .then((genre) => {
            if (!genre) {
                return res.status(404).json({ message: 'Genre not found' });
            }
            res.json(genre);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};


