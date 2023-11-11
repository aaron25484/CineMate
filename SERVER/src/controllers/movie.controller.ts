import { Request, Response } from "express"
import { movieModel } from "../models/movie"
import { userModel } from "../models/user"
import { genreModel } from "../models/genre"

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
    const { name, poster_img, score, genreId } = req.body

    try {
        if(!name || !poster_img || !score || !genreId) throw new Error('Missing fields')

        const newMovie = await movieModel.create({name, poster_img, score, genreId})

        await genreModel.findByIdAndUpdate(
            genreId,
            { $push: { movies: newMovie._id } },
            { new: true }
        );

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

    const deletedMovie = await movieModel.findByIdAndDelete(movieId);

    if (!deletedMovie) {
        return res.status(404).send('Movie not found');
    }

    const genreId = deletedMovie.genreId;
        await genreModel.findByIdAndUpdate(
            genreId,
            { $pull: { movies: movieId } },
            { new: true }
        );

    const user = await userModel.findOne({movies: movieId})

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
    const {name,poster_img,score,genreId} = req.body

    try {
        const movie = await movieModel.findById(movieId)

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const oldGenreId = movie.genreId;

        const updatedMovie = await movieModel.findByIdAndUpdate(
            movieId,
            { $set: { name, poster_img, score, genreId } },
            { new: true }
        );

        if (genreId && oldGenreId !== genreId) {
            await genreModel.findByIdAndUpdate(
                oldGenreId,
                { $pull: { movies: movieId } },
                { new: true }
            );
            await genreModel.findByIdAndUpdate(
                genreId,
                { $push: { movies: updatedMovie?._id } },
                { new: true }
            );
        }
        res.status(201).json(updateMovie)

    } catch (error){
        res.status(500).json(error)
    }
}

export const addToWatchlist = async (req: Request, res: Response) => {
    const {userId} = req.params
    const {movieId} = req.body

    try {
        if (!userId || !movieId) {
            throw new Error ('User ID and Movie ID are required')
        }

        const user = await userModel.findById(userId)

        if (!user){
            return res.status(404).send('User not found')
        }

        await userModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { movies: movieId}}
        )

        res.status(200).json ({ message: 'Movie added to watchlist'})
    } catch (error) {
        res.status(500).json(error)
    }
    
}
