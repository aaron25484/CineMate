import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import mongoose from "mongoose";
import config from "./config/config";
import genreRoutes from "./routes/genre.routes";
import movieRoutes from "./routes/movie.routes";

const app: Application = express()
app.use(express.json())

mongoose.connect(
    config.app.MONGO_DB_URL!)
    .then(()=> console.log("connected to MongoDB"))

app.use("/user", userRoutes)

app.use("/movie", movieRoutes)

app.use("/genre", genreRoutes)

export default app