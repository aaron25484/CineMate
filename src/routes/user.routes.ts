import { Router } from "express";
import { createUser, getAllUsers, getAllUsersRegistered, deleteUser } from "../controllers/user.controller";


const userRoutes = Router()

userRoutes.get('/', getAllUsers)
userRoutes.get("/registered", getAllUsersRegistered)
userRoutes.post("/", createUser)
userRoutes.delete("/:userId", deleteUser)

export default userRoutes