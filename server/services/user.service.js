import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const getAll = async () => {
  return await userModel.getAll();
};

export const getById = async (id) => {
  const user = await userModel.getById(id);
  return user;
};

export const create = async (user) => {
  if (!user) {
    throw new Error('El usuario no puede estar vacío');
  }

  const { nombre, email, password, role } = user;
  if (!nombre || !email || !password) {
    throw new Error('Nombre, email y contraseña son obligatorios');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.create({ nombre, email, passwordHash: hashedPassword, role });
  return { message: 'Usuario agregado exitosamente' };
};

export const validateCredentials = async (name, password) => {
  const user = await userModel.getByName(name);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  delete user.passwordHash;
  return user;
};

export const update = async (id, user) => {
  if (!user) {
    throw new Error('El usuario no puede estar vacío');
  }

  const existing = await userModel.getById(id);
  if (!existing) {
    throw new Error('El usuario no existe');
  }

  let hashedPassword = null;
  if (user.password) {
    hashedPassword = await bcrypt.hash(user.password, 10);
  }

  await userModel.update(id, { email: user.email, passwordHash: hashedPassword, role: user.role });
  return { message: 'Usuario actualizado exitosamente' };
};

export const changePassword = async (id, currentPassword, newPassword) => {
  if (!id || !currentPassword || !newPassword) {
    throw new Error('Debes proporcionar ID, contraseña actual y nueva contraseña');
  }

  const userRow = await userModel.getPasswordHashById(id);
  const hash = userRow?.passwordHash;
  if (!userRow) {
    throw new Error('El usuario no existe');
  }
  if (!hash) {
    throw new Error('No se encontró el hash de la contraseña en el usuario');
  }

  const isValid = await bcrypt.compare(currentPassword, hash);
  if (!isValid) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  await userModel.changePassword(id, newHashedPassword);
  return { message: 'Contraseña actualizada correctamente' };
};

export const deleteById = async (id) => {
  if (!id) {
    throw new Error('El ID no puede estar vacío');
  }
  await userModel.delete(id);
  return { message: 'User deleted successfully' };
};