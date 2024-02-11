import { DB_NAME, MONGODB_URI } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log(`Connect to MongoDB Successfully !, DB Host: ${connectInstance.connection.host}`);
    } catch (error) {
        console.log(`Can't connect to Database !!, error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;