import { Request, Response } from "express"
import { movieModel } from "../models/movie"
import { userModel } from "../models/user"

export const getAllMovies = async(req: Request, res: Response) => {

    try {
        const movies = await movieModel.find()

        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json(error)
    }

}

export const getMovie = async(req: Request, res: Response) => {
    const { params: { movieId }} = req

    try {
        const movie = await movieModel.findById({_id: movieId})

        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createMovie = async (req: Request, res: Response) => {
    const { name, poster_img, score, genre } = req.body
    const { userId } = req.params

    try {
        if(!name || !poster_img || !score || !genre) throw new Error('Missing fields')

        const newMovie = await movieModel.create({name, poster_img, score, genre})

        await userModel.findByIdAndUpdate(
            {_id: userId},
            {$push: { movies: newMovie._id}}
        )
        res.status(201).json(newMovie)

    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
        if (!movieId) {
            return res.status(400).send('Movie ID is required');
    }

    const user = await userModel.findOne({movies: movieId})

    const deletedMovie = await movieModel.findByIdAndDelete(movieId);

    if (!deletedMovie) {
        return res.status(404).send('Movie not found');
    }

    await userModel.findByIdAndUpdate(
        { _id: user!._id },
        { $pull: { movies: movieId}},
    )

    res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });

    } catch (error) {

    res.status(500).send(error);
}
};


export const updateMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const {name,poster_img,score,genre} = req.body

    try {
        const movie = await movieModel.findByIdAndUpdate(
            {_id: movieId},
            {$set: {name: name, poster_img: poster_img, score: score, genre: genre}},
            {new: true}
        )
        res.status(201).json(movie)

    } catch (error){
        res.status(500).json(error)
    }
}
