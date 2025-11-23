import pool from './db.js';  // Importa el pool por defecto

// Exportaciones nombradas (no default)
export const getAll = async () => {
  const [rows] = await pool.execute('SELECT * FROM users ORDER BY id DESC');
  return rows;
};

export const create = async (name, password) => {
  if (!name || !name.trim() || !password || !password.trim()) {
    throw new Error('El nombre o contraseña no puede estar vacío');
  }
  const [result] = await pool.execute('INSERT INTO users (nombre, contrasena) VALUES (?, ?)', [name.trim(), password.trim()]);
  const [newUser] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
  return newUser[0];
};

export const update = async (id, updates) => {
  let query, params;
  if (updates.name !== undefined && updates.password !== undefined) {
    query = 'UPDATE users SET nombre = ?, contrasena = ? WHERE id = ?';
    params = [updates.name, updates.password, id];
  } else if (updates.name !== undefined) {
    query = 'UPDATE users SET nombre = ? WHERE id = ?';
    params = [updates.name, id];
  } else if (updates.password !== undefined) {
    query = 'UPDATE users SET contrasena = ? WHERE id = ?';
    params = [updates.password, id];
  } else {
    throw new Error('Debe proporcionar "name" o "password"');
  }
  const [result] = await pool.execute(query, params);
  if (result.affectedRows === 0) {
    throw new Error('User not found');
  }
  const [updated] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return updated[0];
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error('User not found');
  }
  return { message: 'User deleted successfully' };
};