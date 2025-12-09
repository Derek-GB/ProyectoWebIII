import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Autenticación de usuarios
 */
const router = express.Router();


const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,            
  message: {
    error: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 1 minuto.'
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve token y datos del usuario
 *       401:
 *         description: Credenciales inválidas
 *       429:
 *         description: Demasiados intentos de inicio de sesión
 */
router.post('/login', loginLimiter, authController.login);

export default router;