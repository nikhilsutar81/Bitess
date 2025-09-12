import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend/.env to avoid CWD/import order issues
const envPath = path.resolve(__dirname, "../.env");
console.log("Loading env from:", envPath, "exists:", fs.existsSync(envPath));
dotenv.config({ path: envPath });

export const connectDB = async () => {
  // Normalize potential BOM-prefixed env keys (common on Windows Notepad UTF-8 with BOM)
  const normalizeEnvKey = (key) => {
    if (process.env[key]) return;
    const bomKey = "\uFEFF" + key;
    if (process.env[bomKey]) {
      process.env[key] = process.env[bomKey];
    }
  };
  ["MONGO_URL", "MONGODB_URI", "DATABASE_URL"].forEach(normalizeEnvKey);

  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.DATABASE_URL;
  console.log(
    "Env keys present ->",
    {
      MONGO_URL: Boolean(process.env.MONGO_URL),
      MONGODB_URI: Boolean(process.env.MONGODB_URI),
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
    }
  );
  if (!mongoUrl || typeof mongoUrl !== "string") {
    console.error("Missing MONGO_URL environment variable. Please set it in backend/.env");
    throw new Error("MONGO_URL is not defined");
  }

  await mongoose
    .connect(mongoUrl)
    .then(() => console.log("DB Connected"));
};
