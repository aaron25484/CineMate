import { Router } from "express";
import { createGenre, getAllGenres, deleteGenre, updateGenre, getGenre } from "../controllers/genre.controller";

const genreRoutes = Router()

genreRoutes.get('/', getAllGenres)
genreRoutes.post('/', createGenre)
genreRoutes.delete('/:genreId', deleteGenre)
genreRoutes.get('/:genreId', getGenre)
genreRoutes.patch('/:genreId', updateGenre)

export default genreRoutes