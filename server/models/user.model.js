import pool from '../services/db.js';

class UserModel {
  async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM vwGetAllUsuario');
      return rows || [];
    } catch (error) {
      console.error('Error en UserModel.getAll:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const [rows] = await pool.query('CALL pa_GetUsuarioById(?)', [id]);
      return rows[0]?.[0] || null;
    } catch (error) {
      console.error('Error en UserModel.getById:', error);
      throw error;
    }
  }

  async create({ nombre, email, passwordHash, role }) {
    try {
      const [result] = await pool.query('CALL pa_InsertUsuario(?,?,?,?)', [nombre, email, passwordHash, role ?? null]);
      return result;
    } catch (error) {
      console.error('Error en Usermodel.create:', error);
      throw error;
    }
  }

  async update(id, { email, passwordHash, role }) {
    try {
      const [result] = await pool.query('CALL pa_UpdateUsuario(?,?,?,?)', [id, email ?? null, passwordHash ?? null, role ?? null]);
      return result;
    } catch (error) {
      console.error('Error en UserModel.update:', error);
      throw error;
    }
  }

  async changePassword(id, newHashedPassword) {
    try {
      const [result] = await pool.query('CALL pa_UpdateUsuario(?, ?, ?, ?)', [id, null, newHashedPassword, null]);
      return result;
    } catch (error) {
      console.error('Error en Usermodel.changePassword:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [result] = await pool.execute('CALL pa_DeleteUsuario(?)', [id]);
      return result;
    } catch (error) {
      console.error('Error en UserModel.delete:', error);
      throw error;
    }
  }

  async getPasswordHashById(id) {
    try {
      const [rows] = await pool.query('CALL pa_GetUsuarioPasswordById(?)', [id]);
      return rows[0]?.[0] || null;
    } catch (error) {
      console.error('Error en UserModel.getPasswordHashById:', error);
      throw error;
    }
  }

  async getByName(name) {
    try {
      const [result] = await pool.query('CALL pa_GetUsuarioPorNombre(?)', [name]);
      const rows = result[0];
      return (rows && rows.length > 0) ? rows[0] : null;
    } catch (error) {
      console.error('Error en UserModel.getByName:', error);
      throw error;
    }
  }
}

export default new UserModel();
