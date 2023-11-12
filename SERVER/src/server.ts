import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import genreRoutes from "./routes/genre.routes";
import movieRoutes from "./routes/movie.routes";
import prisma from "./db/client";

const app: Application = express()
app.use(express.json())

prisma.$connect().then(() => {
    console.log("Connected to MongoDB via Prisma");})

app.use("/users", userRoutes)

app.use("/movies", movieRoutes)

app.use("/genres", genreRoutes)

export default app