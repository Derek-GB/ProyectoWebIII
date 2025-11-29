import pool from './db.js';
import bcrypt from 'bcrypt';

export const getAll = async () => {
  const [rows] = await pool.execute('SELECT * FROM vwGetAllUsuario');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.query('CALL pa_GetUsuarioById(?)', [id]);  
  return rows[0][0];
};

export const create = async (user) => {
  if (!user) {
    throw new Error('El usuario no puede estar vacío');
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const [result] = await pool.query(
    'CALL pa_InsertUsuario(?,?,?,?)',
    [user.name, user.email, hashedPassword, user.role]
  );

  return { message: 'Usuario agregado exitosamente' };
};

export const validateCredentials = async (name, password) => {
  const [rows] = await pool.execute(
    'SELECT * FROM usuario WHERE nombre = ?',
    [name]
  );
  if (rows.length === 0) return null;
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  delete user.passwordHash;
  return user;
};

export const update = async (id, user) => {
  if (!user) {
    throw new Error('El usuario no puede estar vacío');
  }
  const [rows] = await pool.execute(
    'SELECT id FROM usuario WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new Error('El usuario no existe');
  }
  let hashedPassword = null;
  if (user.password) {
    hashedPassword = await bcrypt.hash(user.password, 10);
  }
  const [result] = await pool.query(
    'CALL pa_UpdateUsuario(?,?,?,?)',
    [
      id,
      user.email ?? null,
      hashedPassword,
      user.role ?? null
    ]
  );

  return { message: 'Usuario actualizado exitosamente' };

};



  export const deleteById = async (id) => {
  if (!id) {
    throw new Error('El ID no puede estar vacío');
  }
  const [result] = await pool.execute('CALL pa_DeleteUsuario(?)', [id]);
  return { message: 'User deleted successfully' };

};