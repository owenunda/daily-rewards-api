import dailyRewardController from "./daily_reward.controller.js";
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/daily', authMiddleware(), dailyRewardController.grantDailyReward);
router.get('/daily/history', authMiddleware(), dailyRewardController.getHistoryByUserId);
router.get('/cooldown', authMiddleware(), dailyRewardController.getCooldownStatus);

export default router;