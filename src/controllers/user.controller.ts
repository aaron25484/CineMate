import { Request, Response } from "express";
import { userModel } from "../models/user";

export const getAllUsers = (req: Request, res: Response) => {

    res.status(200).send('Get all users')
}

export const getAllUsersRegistered = (req: Request, res: Response) => {
    res.status(200).send('Registered Users')
}

export const createUser = (req: Request, res: Response) => {

    const user = new userModel(req.body)
    user.save().then((data) => res.json(data)).catch((error) => res.json({message:error}))
    // res.status(200).send('User created succesfully')
}

export const deleteUser = (req: Request, res: Response) => {
    const { params: { userId } } = req;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    userModel
        .findByIdAndDelete(userId)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).send('User not found');
            }
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        })
        .catch((error) => {
            res.status(500).json({ message: 'An error occurred', error });
        });
}

export const updateUser = (req: Request, res: Response) => {
    const id = req.params.id

    res.send(`User with ID ${id} update succesfully`)
}

