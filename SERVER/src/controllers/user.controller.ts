import { Request, Response } from "express";
import { userModel } from "../models/user";
import prisma from "../db/client";

export const getAllUsers = async(req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany()

        res.status(201).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { params: { userId } } = req;

    try {
        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {movies:true}
        }
        )

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    try {
        if(!name || !email || !password) throw new Error('Missing fields')

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password,
                movies: {
                create: [],
            
            },
        }});
        res.status(201).json(newUser)

        console.log(newUser)

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { params: { userId } } = req;

    try {
        if (!userId) {
            return res.status(400).send('User ID is required');
    }

    const deletedUser = await prisma.user.delete({
        where: {id: userId},
    });

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
    const { name, email, password} = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data:{name,email,password},
            select:{name:true,email:true,password:true,updatedAt:true}
        })
        res.status(201).json(updatedUser)
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

        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {movies:true}
        })

        if (!user) {
            return res.status(404).send('User not found')
        }

        const watchlist = user.watchlist

        res.status(200).json(watchlist)
    } catch (error) {
        res.status(500).json(error)
        
    }
}

export const deleteFromWatchlist = async (req: Request, res: Response) => {
    const { movieId, userId } = req.params;

    try {

        const user = await prisma. user.findUnique({
            where: {id: userId},
        })
        const deleteMovieFromWatchlist = user?.watchlist.filter(id => id !==movieId)


    if (!user) {
        return res.status(404).send('User not found');
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            watchlist: deleteMovieFromWatchlist
        },
    })

    res.status(200).json({ message: 'Movie deleted from user successfully' });

    } catch (error) {

    res.status(500).send(error);
}
}