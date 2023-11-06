import { Request, Response } from "express"

export const getAllMovies = (req: Request, res: Response) => {

    res.status(200).send('Get all movies')
}

export const createMovie = (req: Request, res: Response) => {
    res.status(200).send('Create movie')
}