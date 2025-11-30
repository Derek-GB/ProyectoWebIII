import pool from './db.js'; 

export const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM vwGetAllHorario');  
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.query('CALL pa_GetHorarioById(?)', [id]);  
  return rows[0][0];
};

export const create = async (schedule) => {
  if (!schedule) {
    throw new Error('El horario no puede estar vacío');
  }
  const [result] = await pool.query('CALL pa_InsertHorario(?,?,?,?,?,?)', [schedule.aula_id, schedule.profesor_id, schedule.dia_semana, schedule.hora_inicio, schedule.hora_fin, schedule.curso]);
  return { message: 'Horario agregado exitosamente' };
};

export const update = async (id, schedule) => {
  if (!schedule) {
    throw new Error('El horario no puede estar vacío');
  }
  const [result] = await pool.query('CALL pa_UpdateHorario(?,?,?,?,?,?)', [id, schedule.aula_id ?? null, schedule.profesor_id ?? null, schedule.dia_semana ?? null, schedule.hora_inicio ?? null, schedule.hora_fin ?? null]);
  return { message: 'Horario actualizado exitosamente' };
};

export const deleteById = async (id) => {
  const [result] = await pool.query('CALL pa_DeleteHorario(?)', [id]);
  if (result.affectedRows === 0) {
    throw new Error('Horario no encontrado');
  }
  return { message: 'Horario eliminado exitosamente' };
};

export const getScheduleByTeacherAndDay = async (teacher,day,hour) => {
  const [rows] = await pool.query('CALL pa_SelectHorarioPorProfesorYDia(?,?,?)', [teacher, day, hour]);  
  return rows[0];
};

export const getScheduleByCourseAndDay = async (course,day,hour) => {
  const [rows] = await pool.query('CALL pa_SelectHorarioPorCursoYDia(?,?,?)', [course, day, hour]);  
  return rows[0];
};

export const getClassByCourseAndDay = async (teacher,numberClass,typeClass) => {
  const [rows] = await pool.query('CALL pa_SelectHorarioPorProfesorYAula(?,?,?)', [teacher, numberClass, typeClass]);  
  return rows[0];
};

export const getTeacherByClassAndDay = async (numberClass,typeClass,day,hour) => {
  const [rows] = await pool.query('CALL pa_SelectProfesorEnAulaPorHora(?,?,?,?)', [numberClass, typeClass, day, hour]);  
  return rows[0];
}; 