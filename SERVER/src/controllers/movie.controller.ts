import { Request, Response } from "express"
import { movieModel } from "../models/movie"
import { userModel } from "../models/user"
import { genreModel } from "../models/genre"
import prisma from "../db/client"

export const getAllMovies = async(req: Request, res: Response) => {

    try {
        const movies = await prisma.movie.findMany()

        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json(error)
    }

}

export const getMovie = async(req: Request, res: Response) => {
    const { params: { movieId }} = req

    try {
        const movie = await prisma.movie.findUnique({
            where: {id: movieId}})

        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createMovie = async (req: Request, res: Response) => {
    const { name, poster_img, score, genre } = req.body

try {
    if (!name || !poster_img || !score || !genre) {
        throw new Error('Missing fields');
    }

    const existingGenre = await prisma.genre.findUnique({
        where: { name: genre },
    });

    if (!existingGenre) {
        throw new Error('Invalid genre'); 
    }

    const newMovie = await prisma.movie.create({
        data: {
            name,
            poster_img,
            score,
            genre: {
                connect: { name: existingGenre.name },
            },
        },
    });

    res.status(201).json(newMovie);
} catch (error) {
    res.status(500).json({ message: 'Internal server error' });
}
};

export const deleteMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
        if (!movieId) {
            return res.status(400).send('Movie ID is required');
    }

    const deletedMovie = await prisma.movie.findUnique({
        where: {id:movieId},
        include: {genre: true, User: true}
    });

    if (!deletedMovie) {
        return res.status(404).send('Movie not found');
    }

    const genreId = deletedMovie.genre.id;

        await prisma.genre.update({
            where: { id: genreId },
            data: {
                movies: {
                    disconnect: { id: movieId },
                }
                }
            })
        
    const userId = deletedMovie.User?.id;
    await prisma.user.update({
        where: { id: userId },
        data: {
            movies: {
                disconnect: { id: movieId },
            },
            
            }
        })

        await prisma.movie.delete({
            where: { id: movieId } 
        })

    res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });

    } catch (error) {

    res.status(500).send(error);
}
};

export const updateMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const {name,poster_img,score,genre} = req.body

    try {
        const movie = await prisma.movie.findUnique({
            where: {id: movieId}})

        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        const oldGenreId = movie.genreId;

        const updatedMovie = await prisma.movie.update({
            where: { id: movieId },
            data: { name, poster_img, score, genre:{
                connect: { name: genre }
            }},
            include:{genre:true}
        })

        if (genre && oldGenreId !== updatedMovie.genre.id) {
            await prisma.genre.update({
                where: { id: oldGenreId },
                data: {movies:{disconnect:{id:movieId}}}                
            })

            await prisma.genre.update({
                where: { id: updatedMovie.genre.id },
                data: {movies:{connect:{id:updatedMovie.id}}}
            });
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

        const user = await prisma.user.findUnique({
            where: {id: userId},
        })
        user?.watchlist.push(movieId)
        
        if (!userId || !movieId) {
            throw new Error ('User ID and Movie ID are required')
        }

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                watchlist: user?.watchlist
            },
        })


        res.status(200).json ({ message: 'Movie added to watchlist'})
    } catch (error) {
        res.status(500).json(error)
    }
    
}
