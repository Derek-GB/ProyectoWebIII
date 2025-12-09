import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await authService.login(name, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
