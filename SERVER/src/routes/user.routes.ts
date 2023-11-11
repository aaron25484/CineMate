import { Router } from "express";
import { createUser, getAllUsers, deleteUser, updateUser, getUser, getUserWatchlist, deleteFromWatchlist } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get('/', getAllUsers)
userRoutes.post('/', createUser)
userRoutes.delete('/:userId', deleteUser)
userRoutes.delete('/watchlist/:movieId', deleteFromWatchlist)
userRoutes.get('/:userId', getUser)
userRoutes.get('/userId/watchlist', getUserWatchlist)
userRoutes.patch('/:userId', updateUser)

export default userRoutes