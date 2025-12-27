import dailyRewardService from './daily_reward.service.js';

const grantDailyReward = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const reward = await dailyRewardService.grantDailyReward(userId);
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export default {
  grantDailyReward
}