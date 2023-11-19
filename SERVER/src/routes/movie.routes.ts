import { Router } from "express";
import { getAllMovies, createMovie, deleteMovie, getMovie, updateMovie, addToWatchlist } from "../controllers/movie.controller";
import { checkJWTMiddleware } from "../middleware/checkJWT.middleware";

const movieRoutes = Router()

movieRoutes.get('/', getAllMovies)
movieRoutes.post('/' ,createMovie)
movieRoutes.post('/:userId/watchlist/:movieId', addToWatchlist)
movieRoutes.delete('/:movieId', deleteMovie)
movieRoutes.get('/:movieId', getMovie)
movieRoutes.patch('/:movieId', updateMovie)

export default movieRoutes