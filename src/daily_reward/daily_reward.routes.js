import dailyRewardController from "./daily_reward.controller.js";
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

/**
 * @swagger
 * /api/rewards/daily:
 *   post:
 *     summary: Reclamar recompensa diaria
 *     description: Permite al usuario reclamar su recompensa diaria. Solo se puede reclamar una vez cada 24 horas. Las recompensas aumentan con la racha de días consecutivos.
 *     tags: [Daily Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recompensa reclamada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyReward'
 *             examples:
 *               newStreak:
 *                 summary: Nueva racha
 *                 value:
 *                   id: 1
 *                   user_id: 1
 *                   coins: 100
 *                   streak: 1
 *                   claimed_at: 2025-12-28T10:00:00Z
 *               continuedStreak:
 *                 summary: Racha continua (más recompensas)
 *                 value:
 *                   id: 5
 *                   user_id: 1
 *                   coins: 500
 *                   streak: 5
 *                   claimed_at: 2025-12-28T10:00:00Z
 *       400:
 *         description: No se puede reclamar la recompensa (cooldown activo)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               cooldownActive:
 *                 summary: Cooldown activo
 *                 value:
 *                   error: Debes esperar 24 horas antes de reclamar otra recompensa
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/daily', authMiddleware(), dailyRewardController.grantDailyReward);

/**
 * @swagger
 * /api/rewards/daily/history:
 *   get:
 *     summary: Obtener historial de recompensas
 *     description: Devuelve el historial completo de todas las recompensas reclamadas por el usuario
 *     tags: [Daily Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RewardHistory'
 *             examples:
 *               multipleRewards:
 *                 summary: Historial con múltiples recompensas
 *                 value:
 *                   - id: 1
 *                     user_id: 1
 *                     coins: 100
 *                     streak: 1
 *                     claimed_at: 2025-12-25T10:00:00Z
 *                   - id: 2
 *                     user_id: 1
 *                     coins: 200
 *                     streak: 2
 *                     claimed_at: 2025-12-26T10:00:00Z
 *                   - id: 3
 *                     user_id: 1
 *                     coins: 300
 *                     streak: 3
 *                     claimed_at: 2025-12-27T10:00:00Z
 *               emptyHistory:
 *                 summary: Sin recompensas previas
 *                 value: []
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/daily/history', authMiddleware(), dailyRewardController.getHistoryByUserId);

/**
 * @swagger
 * /api/rewards/cooldown:
 *   get:
 *     summary: Verificar estado del cooldown
 *     description: Verifica si el usuario puede reclamar una recompensa y cuánto tiempo falta para la próxima
 *     tags: [Daily Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado del cooldown obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CooldownStatus'
 *             examples:
 *               canClaim:
 *                 summary: Puede reclamar recompensa
 *                 value:
 *                   canClaim: true
 *                   nextClaimTime: null
 *                   timeRemaining: null
 *                   currentStreak: 3
 *               cooldownActive:
 *                 summary: Cooldown activo
 *                 value:
 *                   canClaim: false
 *                   nextClaimTime: 2025-12-29T10:00:00Z
 *                   timeRemaining: 43200
 *                   currentStreak: 5
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/cooldown', authMiddleware(), dailyRewardController.getCooldownStatus);

export default router;