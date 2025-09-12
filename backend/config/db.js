import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Uses Vercel env variables automatically

export const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!mongoUrl || typeof mongoUrl !== "string") {
    console.error("Missing MONGO_URL environment variable. Please set it in Vercel dashboard.");
    throw new Error("MONGO_URL is not defined");
  }
  await mongoose.connect(mongoUrl)
    .then(() => console.log("DB Connected"));
};
