import pool from '../services/db.js';

class TeacherModel {
  async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM vwGetAllProfesor');
      return rows || [];
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const [rows] = await pool.query('CALL pa_GetProfesorById(?)', [id]);
      return rows[0]?.[0] || null;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  async create(teacher) {
    const { nombre, correo, especialidad } = teacher;
    try {
      const [result] = await pool.query('CALL pa_InsertProfesor(?,?,?)', 
        [nombre, correo, especialidad]);
      return result;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id, teacher) {
    const { nombre, correo, especialidad } = teacher;
    try {
      const [result] = await pool.query('CALL pa_UpdateProfesor(?,?,?,?)', 
        [id, nombre ?? null, correo ?? null, especialidad ?? null]);
      return result;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [result] = await pool.query('CALL pa_DeleteProfesor(?)', [id]);
      return result;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  async getScheduleByTeacher(nombre) {
    try {
      const [result] = await pool.query('CALL pa_GetHorariosByProfesor(?)', [nombre]);
      return result[0] || null;
    } catch (error) {
      console.error('Error en getScheduleByTeacher:', error);
      throw error;
    }
  }
}

export default new TeacherModel();
