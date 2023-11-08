import { Request, Response } from "express";
import { userModel } from "../models/user";

export const getAllUsers = (req: Request, res: Response) => {
    userModel.find().then((data) => res.json(data)).catch((error) => res.json({message:'wronggg'}))

}

export const getUser = (req: Request, res: Response) => {
    const { params: { userId } } = req;

    userModel.findById(userId).then((user) => res.json(user))
}

export const createUser = (req: Request, res: Response) => {
    const user = new userModel(req.body)
    user.save().then((data) => res.json(data)).catch((error) => res.json({message:'wronggg'}))
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
};

export const updateUser = (req: Request, res: Response) => {
    const { params: { userId }, body } = req;

    userModel.findByIdAndUpdate(userId, body, { new: true })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
};


