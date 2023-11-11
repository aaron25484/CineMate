import { Request, Response } from "express";
import { userModel } from "../models/user";

export const getAllUsers = async(req: Request, res: Response) => {

    try {
        const users = await userModel.find()

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }

}

export const getUser = async (req: Request, res: Response) => {
    const { params: { userId } } = req;

    try {
        const user = await userModel.findById({_id: userId}).populate('movies')

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    try {
        if(!name || !email || !password) throw new Error('Missing fields')

        const newUser = await userModel.create({name,email,password})

        res.status(201).json(newUser)

    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { params: { userId } } = req;

    try {
        if (!userId) {
            return res.status(400).send('User ID is required');
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
        return res.status(404).send('User not found');
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });

    } catch (error) {

    res.status(500).send(error);
}
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email} = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(
            {_id: userId}, 
            {$set: {name: name, email: email} }, 
            {new: true}
        )
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
};

export const getUserWatchlist = async (req: Request, res: Response) => {
    const {userId} = req.params

    try {
        if (!userId) {
            throw new Error('User ID is required')
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).send('User not found')
        }

        const watchlist = user.movies

        res.status(200).json(watchlist)
    } catch (error) {
        res.status(500).json(error)
        
    }
}

export const deleteFromWatchlist = async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
        if (!movieId) {
            return res.status(400).send('Movie ID is required');
    }

    const user = await userModel.findOne({movies: movieId})

    if (!user) {
        return res.status(404).send('User not found');
    }

    await userModel.findByIdAndUpdate(
        { _id: user!._id },
        { $pull: { movies: movieId}},
    )

    res.status(200).json({ message: 'Movie deleted from user successfully' });

    } catch (error) {

    res.status(500).send(error);
}
}