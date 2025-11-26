import pool from './db.js';

export const getAll = async () => {
  const [rows] = await pool.execute('CALL pa_getAllUsuarios()');
  return rows;
};

export const create = async (name, email, passwordHash, role) => {
  if (
    !name?.trim() ||
    !email?.trim() ||
    !passwordHash?.trim() ||
    !role?.trim()
  ) {
    throw new Error('Ningún campo puede estar vacío');
  }

  const [result] = await pool.execute(
    'CALL pa_createUsuario(?, ?, ?, ?)',
    [name.trim(), email.trim(), passwordHash.trim(), role.trim()]
  );

  return result[0][0];
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
  const [result] = await pool.execute('CALL pa_deleteUsuario(?)', [id]);
  return { message: 'User deleted successfully' };

};