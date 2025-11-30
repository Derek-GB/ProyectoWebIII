import express from 'express';
import { login } from '../services/auth.service.js';

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Autenticación de usuarios
 */
const router = express.Router();


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
 */
router.post('/login', async (req, res) => {
  const { name, password } = req.body; 
  try {
    const result = await login(name, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router;