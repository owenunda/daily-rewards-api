import dailyRewardService from './daily_reward.service.js';

const grantDailyReward = async (req, res, next) => {
  try {
    const userId = req.user.id
    const reward = await dailyRewardService.grantDailyReward(userId);
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getHistoryByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await dailyRewardService.getHistoryByUserId(userId);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export default {
  grantDailyReward,
  getHistoryByUserId
}