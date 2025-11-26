import pool from './db.js';

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
  const [result] = await pool.query('CALL pa_InsertUsuario(?,?,?,?)', [user.name, user.email, user.password, user.role]);
  return { message: 'Usuario agregado exitosamente' };
};

// export const update = async (id, updates) => {
//   let query, params;
//   if (updates.name !== undefined && updates.password !== undefined) {
//     query = 'UPDATE users SET nombre = ?, contrasena = ? WHERE id = ?';
//     params = [updates.name, updates.password, id];
//   } else if (updates.name !== undefined) {
//     query = 'UPDATE users SET nombre = ? WHERE id = ?';
//     params = [updates.name, id];
//   } else if (updates.password !== undefined) {
//     query = 'UPDATE users SET contrasena = ? WHERE id = ?';
//     params = [updates.password, id];
//   } else {
//     throw new Error('Debe proporcionar "name" o "password"');
//   }
//   const [result] = await pool.execute(query, params);
//   if (result.affectedRows === 0) {
//     throw new Error('User not found');
//   }
//   const [updated] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
//   return updated[0];
// };



  export const deleteById = async (id) => {
  if (!id) {
    throw new Error('El ID no puede estar vacío');
  }
  const [result] = await pool.execute('CALL pa_DeleteUsuario(?)', [id]);
  return { message: 'User deleted successfully' };

};