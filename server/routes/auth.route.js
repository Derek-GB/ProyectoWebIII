import express from 'express';
import { login } from '../services/auth.service.js';

const router = express.Router();

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