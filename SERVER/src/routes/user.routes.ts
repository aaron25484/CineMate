import { Router } from "express";
import { getAllUsers, deleteUser, updateUser, getUser, getUserWatchlist, deleteFromWatchlist, createUser } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get('/', getAllUsers)
userRoutes.post('/', createUser)
userRoutes.delete('/:userId', deleteUser)
userRoutes.delete('/:userId/watchlist/:movieId', deleteFromWatchlist)
userRoutes.get('/:userId', getUser)
userRoutes.get('/:userId/watchlist', getUserWatchlist)
userRoutes.patch('/:userId', updateUser)

export default userRoutes