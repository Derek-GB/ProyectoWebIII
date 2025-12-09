import pool from '../services/db.js';

class ScheduleModel {
  async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM vwGetAllHorario');
      return rows || [];
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const [rows] = await pool.query('CALL pa_GetHorarioById(?)', [id]);
      return rows[0]?.[0] || null;
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  }

  async create(schedule) {
    const { aula_id, profesor_id, dia_semana, hora_inicio, hora_fin, curso } = schedule;
    try {
      const [result] = await pool.query('CALL pa_InsertHorario(?,?,?,?,?,?)', 
        [aula_id, profesor_id, dia_semana, hora_inicio, hora_fin, curso]);
      return result;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id, schedule) {
    const { aula_id, profesor_id, dia_semana, hora_inicio, hora_fin } = schedule;
    try {
      const [result] = await pool.query('CALL pa_UpdateHorario(?,?,?,?,?,?)', 
        [id, aula_id ?? null, profesor_id ?? null, dia_semana ?? null, hora_inicio ?? null, hora_fin ?? null]);
      return result;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [result] = await pool.query('CALL pa_DeleteHorario(?)', [id]);
      return result;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  async getScheduleByTeacherAndDay(teacher, day, hour) {
    try {
      const [rows] = await pool.query('CALL pa_SelectHorarioPorProfesorYDia(?,?,?)', [teacher, day, hour]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en getScheduleByTeacherAndDay:', error);
      throw error;
    }
  }

  async getScheduleByCourseAndDay(course, day, hour) {
    try {
      const [rows] = await pool.query('CALL pa_SelectHorarioPorCursoYDia(?,?,?)', [course, day, hour]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en getScheduleByCourseAndDay:', error);
      throw error;
    }
  }

  async getClassByCourseAndDay(teacher, numberClass, typeClass) {
    try {
      const [rows] = await pool.query('CALL pa_SelectHorarioPorProfesorYAula(?,?,?)', [teacher, numberClass, typeClass]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en getClassByCourseAndDay:', error);
      throw error;
    }
  }

  async getTeacherByClassAndDay(numberClass, typeClass, day, hour) {
    try {
      const [rows] = await pool.query('CALL pa_SelectProfesorEnAulaPorHora(?,?,?,?)', [numberClass, typeClass, day, hour]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error en getTeacherByClassAndDay:', error);
      throw error;
    }
  }

  async deleteAll() {
    try {
      const [result] = await pool.query('CALL pa_DeleteAllHorario()');
      return result;
    } catch (error) {
      console.error('Error en deleteAll:', error);
      throw error;
    }
  }
}

export default new ScheduleModel();
