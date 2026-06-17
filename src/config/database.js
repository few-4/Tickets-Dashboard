import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Database connected successfully!")
    } catch (error) {
        console.log("Error connecting to database",error);
        process.exit(1);
    }
}

export default connectToDB;