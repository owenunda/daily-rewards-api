import userController from "./user.controller.js";
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.get('/me', authMiddleware(), userController.getUser);


export default router;