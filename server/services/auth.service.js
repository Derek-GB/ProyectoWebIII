import jwt from 'jsonwebtoken';
import { validateCredentials } from './user.service.js';

export const login = async (name, password) => {
  const user = await validateCredentials(name, password);
  if (!user) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: Number(process.env.JWT_EXPIRES) }
  );

  return { token, user };
};