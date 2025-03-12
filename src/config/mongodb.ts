// src/config/mongodb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDbURL = process.env.MONGODB_URL_STRING as string;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDbURL);
    console.log("Mongodb Connected!!!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Lanza el error para que sea manejado en app.ts
  }
};

export default connectDB;
