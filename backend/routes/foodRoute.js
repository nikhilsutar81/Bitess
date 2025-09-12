import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
// import multer from "multer"; // Disabled for Vercel
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image upload disabled for Vercel
foodRouter.post("/add",authMiddleware,addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);

export default foodRouter;
