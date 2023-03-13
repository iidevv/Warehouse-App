import { config } from 'dotenv';

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import {userRouter} from "./routes/users.js"

config();
const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;


const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);

mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`);

app.listen(port, () => console.log('Server started!'));