import dailyRewardController from "./daily_reward.controller.js";
import express from "express";
const router = express.Router();

router.post('/daily', dailyRewardController.grantDailyReward);


export default router;