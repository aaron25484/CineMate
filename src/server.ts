import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import mongoose from "mongoose";
import config from "./config/config";


const app: Application = express()
app.use(express.json())

mongoose.connect(
    config.app.MONGO_DB_URL!).then(()=> console.log("connected to MongoDB"))



app.use("/user", userRoutes)
export default app