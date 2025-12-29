import authController from "./auth.controller.js";
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica a un usuario con email y contraseña, devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             loginExample:
 *               summary: Ejemplo de login
 *               value:
 *                 email: usuario@ejemplo.com
 *                 password: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               success:
 *                 summary: Respuesta exitosa
 *                 value:
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   user:
 *                     id: 1
 *                     email: usuario@ejemplo.com
 *                     created_at: 2025-12-28T10:00:00Z
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalidCredentials:
 *                 summary: Credenciales incorrectas
 *                 value:
 *                   error: Email o contraseña incorrectos
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             registerExample:
 *               summary: Ejemplo de registro
 *               value:
 *                 email: nuevo@ejemplo.com
 *                 password: password123
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               success:
 *                 summary: Registro exitoso
 *                 value:
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   user:
 *                     id: 2
 *                     email: nuevo@ejemplo.com
 *                     created_at: 2025-12-28T10:00:00Z
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               emailExists:
 *                 summary: Email ya existe
 *                 value:
 *                   error: El email ya está registrado
 *               invalidEmail:
 *                 summary: Email inválido
 *                 value:
 *                   error: El email no es válido
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/register', authController.register);

export default router;