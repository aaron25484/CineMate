import { Router } from "express";
import { createUser, getAllUsers, deleteUser, updateUser, getUser } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get('/', getAllUsers)
userRoutes.post('/', createUser)
userRoutes.delete('/:userId', deleteUser)
userRoutes.get('/:userId', getUser)
userRoutes.patch('/:userId', updateUser)

export default userRoutes