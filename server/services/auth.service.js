import jwt from 'jsonwebtoken';
import authModel from '../models/auth.model.js';

export const login = async (name, password) => {
  const user = await authModel.authenticate(name, password);
  if (!user) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: Number(process.env.JWT_EXPIRES) }
  );

  return { token, user };
};