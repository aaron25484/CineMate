import { Request, Response } from "express"
import { movieModel } from "../models/movie"

export const getAllMovies = (req: Request, res: Response) => {
    movieModel.find().then((data) => res.json(data)).catch((error) => res.json({message:'Could not get movies'}))
}

export const getMovie = (req: Request, res: Response) => {
    const { params: { movieId }} = req

    movieModel.findById(movieId).then((movie) => res.json(movie))
}

export const createMovie = (req: Request, res: Response) => {
    const movie = new movieModel(req.body)
    movie.save().then((data) => res.json(data)).catch((error) => res.json({message:'wronggg'}))
}

export const deleteMovie = (req: Request, res: Response) => {
    const { params: { movieId } } = req;

    if (!movieId) {
        return res.status(400).send('Movie ID is required')
    }

    movieModel
    .findByIdAndDelete(movieId)
    .then((deletedMovie) => {
        if(!deletedMovie) {
            return res.status(404).send('Movie not found')
        }
        res.status(200).json({ message: 'Movie deleted successfully', deletedMovie})
    })
}

export const updateMovie = (req: Request, res: Response) => {
    const { params: { movieId }, body } = req;

    movieModel.findByIdAndUpdate(movieId, body, { new: true})
        .then((movie)=> {
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.json(movie);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        })
}
