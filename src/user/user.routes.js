import userController from "./user.controller.js";
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     description: Devuelve la información del usuario actual basado en el token JWT
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 summary: Usuario encontrado
 *                 value:
 *                   id: 1
 *                   email: usuario@ejemplo.com
 *                   created_at: 2025-12-28T10:00:00Z
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/me', authMiddleware(), userController.getUser);


export default router;