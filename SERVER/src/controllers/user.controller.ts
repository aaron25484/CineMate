import { Request, Response } from "express";
import { prismaClient } from "../db/client";
import { convertToType } from "../utils/utils";
import {auth} from 'express-oauth2-jwt-bearer'
export const getAllUsers = async(req: Request, res: Response) => {
    try {
        const users = await prismaClient.user.findMany()

        res.status(201).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { params: { userId } } = req;

    try {
        const user = await prismaClient.user.findUnique({
            where: {id: convertToType(userId)},
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
    try {
        if (!req.auth || !req.auth.payload) {
            throw new Error('Invalid or missing JWT payload');
          }
        const { sub, email, name } = req.auth?.payload;

        const existingUser = await prismaClient.user.findUnique({
            where: { auth0UserId: sub },
          });
          if (existingUser) {
            // User already exists, you can perform additional actions if needed
            console.log('User already exists:', existingUser);
            res.status(200).json(existingUser);
          } else {
            // User doesn't exist, create a new user record in the database
            const newUser = await prismaClient.user.create({
              data: {
                auth0UserId: sub,
                name,
                email,
                password: '', // Note: You might want to handle this differently based on your authentication flow
                movies: {
                  create: [],
                },
              },
            });
      
            console.log('New user created:', newUser);
            res.status(201).json(newUser);
          }
        } catch (error) {
          console.error('Error creating user:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      };

export const deleteUser = async (req: Request, res: Response) => {
    const { params: { userId } } = req;

    try {
        if (!userId) {
            return res.status(400).send('User ID is required');
    }

    const deletedUser = await prismaClient.user.delete({
        where: {id: convertToType(userId)},
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
        const updatedUser = await prismaClient.user.update({
            where: {id: convertToType(userId)},
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

        const user = await prismaClient.user.findUnique({
            where: {id: convertToType(userId)},
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

        const user = await prismaClient.user.findUnique({
            where: {id: convertToType(userId)},
        })
        const deleteMovieFromWatchlist = user?.watchlist.filter((id: string | number) => id !==movieId)


    if (!user) {
        return res.status(404).send('User not found');
    }

    await prismaClient.user.update({
        where: {
            id: convertToType(userId),
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