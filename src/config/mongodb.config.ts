//Configuration for connecting to MongoDB database
// To-Do: add SQL compatibility

import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";
import { logger } from "./logger.config.js";

export default function databaseSetup() {

    mongoose.connect(process.env.MONGO_URI!)
        .then(() => logger.info(`Connected to MongoDB at ${process.env.MONGO_URI}`))
        .catch(err => logger.error(err));

};