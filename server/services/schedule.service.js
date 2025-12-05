import pool from './db.js'; 

const isValidId = (id) => id && Number.isInteger(Number(id)) && Number(id) > 0;
const isValidTime = (time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const isValidDayOfWeek = (day) => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(day);

export const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM vwGetAllHorario');  
  return rows || [];
};

export const getById = async (id) => {
  if (!isValidId(id)) {
    throw new Error('ID de horario inválido. Debe ser un número entero positivo');
  }
  const [rows] = await pool.query('CALL pa_GetHorarioById(?)', [id]);  
  if (!rows || !rows[0] || !rows[0][0]) {
    throw new Error('Horario no encontrado');
  }
  return rows[0][0];
};

export const create = async (schedule) => {
  if (!schedule) {
    throw new Error('El horario no puede estar vacío');
  }
  if (!schedule.aula_id || !isValidId(schedule.aula_id)) {
    throw new Error('ID de aula inválido. Debe ser un número entero positivo');
  }
  if (!schedule.profesor_id || !isValidId(schedule.profesor_id)) {
    throw new Error('ID de profesor inválido. Debe ser un número entero positivo');
  }
  if (!schedule.dia_semana || !isValidDayOfWeek(schedule.dia_semana)) {
    throw new Error('Día de la semana inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo');
  }
  if (!schedule.hora_inicio || !isValidTime(schedule.hora_inicio)) {
    throw new Error('Hora de inicio inválida. Formato requerido: HH:mm');
  }
  if (!schedule.hora_fin || !isValidTime(schedule.hora_fin)) {
    throw new Error('Hora de fin inválida. Formato requerido: HH:mm');
  }
  if (schedule.hora_inicio >= schedule.hora_fin) {
    throw new Error('La hora de inicio debe ser menor que la hora de fin');
  }
  if (!schedule.curso || typeof schedule.curso !== 'string' || schedule.curso.trim() === '') {
    throw new Error('Curso no válido. Debe ser una cadena no vacía');
  }
  
  const [result] = await pool.query('CALL pa_InsertHorario(?,?,?,?,?,?)', [schedule.aula_id, schedule.profesor_id, schedule.dia_semana, schedule.hora_inicio, schedule.hora_fin, schedule.curso]);
  return { message: 'Horario agregado exitosamente' };

};

export const update = async (id, schedule) => {
  if (!isValidId(id)) {
    throw new Error('ID de horario inválido. Debe ser un número entero positivo');
  }
  if (!schedule) {
    throw new Error('El horario no puede estar vacío');
  }
  if (schedule.aula_id !== undefined && schedule.aula_id !== null && !isValidId(schedule.aula_id)) {
    throw new Error('ID de aula inválido. Debe ser un número entero positivo');
  }
  if (schedule.profesor_id !== undefined && schedule.profesor_id !== null && !isValidId(schedule.profesor_id)) {
    throw new Error('ID de profesor inválido. Debe ser un número entero positivo');
  }
  if (schedule.dia_semana !== undefined && schedule.dia_semana !== null && !isValidDayOfWeek(schedule.dia_semana)) {
    throw new Error('Día de la semana inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo');
  }
  if (schedule.hora_inicio !== undefined && schedule.hora_inicio !== null && !isValidTime(schedule.hora_inicio)) {
    throw new Error('Hora de inicio inválida. Formato requerido: HH:mm');
  }
  if (schedule.hora_fin !== undefined && schedule.hora_fin !== null && !isValidTime(schedule.hora_fin)) {
    throw new Error('Hora de fin inválida. Formato requerido: HH:mm');
  }
  
  const [result] = await pool.query('CALL pa_UpdateHorario(?,?,?,?,?,?)', [id, schedule.aula_id ?? null, schedule.profesor_id ?? null, schedule.dia_semana ?? null, schedule.hora_inicio ?? null, schedule.hora_fin ?? null]);
  if (result.affectedRows === 0) {
    throw new Error('Horario no encontrado');
  }
  return { message: 'Horario actualizado exitosamente' };
};

export const deleteById = async (id) => {
  if (!isValidId(id)) {
    throw new Error('ID de horario inválido. Debe ser un número entero positivo');
  }
  const [result] = await pool.query('CALL pa_DeleteHorario(?)', [id]);
  if (result.affectedRows === 0) {
    throw new Error('Horario no encontrado');
  }
  return { message: 'Horario eliminado exitosamente' };
};

export const getScheduleByTeacherAndDay = async (teacher,day,hour) => {
  if (!isValidId(teacher)) {
    throw new Error('ID de profesor inválido. Debe ser un número entero positivo');
  }
  if (!isValidDayOfWeek(day)) {
    throw new Error('Día de la semana inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo');
  }
  if (!isValidTime(hour)) {
    throw new Error('Hora inválida. Formato requerido: HH:mm');
  }
  
  const [rows] = await pool.query('CALL pa_SelectHorarioPorProfesorYDia(?,?,?)', [teacher, day, hour]);  
  return rows[0] || null;
};

export const getScheduleByCourseAndDay = async (course,day,hour) => {
  if (!course || typeof course !== 'string' || course.trim() === '') {
    throw new Error('Curso no válido. Debe ser una cadena no vacía');
  }
  if (!isValidDayOfWeek(day)) {
    throw new Error('Día de la semana inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo');
  }
  if (!isValidTime(hour)) {
    throw new Error('Hora inválida. Formato requerido: HH:mm');
  }
  
  const [rows] = await pool.query('CALL pa_SelectHorarioPorCursoYDia(?,?,?)', [course, day, hour]);  
  return rows[0] || null;
};

export const getClassByCourseAndDay = async (teacher,numberClass,typeClass) => {
  if (!isValidId(teacher)) {
    throw new Error('ID de profesor inválido. Debe ser un número entero positivo');
  }
  if (!numberClass || typeof numberClass !== 'string' || numberClass.trim() === '') {
    throw new Error('Número de aula no válido. Debe ser una cadena no vacía');
  }
  if (!typeClass || typeof typeClass !== 'string' || typeClass.trim() === '') {
    throw new Error('Tipo de aula no válido. Debe ser una cadena no vacía');
  }
  
  const [rows] = await pool.query('CALL pa_SelectHorarioPorProfesorYAula(?,?,?)', [teacher, numberClass, typeClass]);  
  return rows[0] || null;
};

export const getTeacherByClassAndDay = async (numberClass,typeClass,day,hour) => {
  if (!numberClass || typeof numberClass !== 'string' || numberClass.trim() === '') {
    throw new Error('Número de aula no válido. Debe ser una cadena no vacía');
  }
  if (!typeClass || typeof typeClass !== 'string' || typeClass.trim() === '') {
    throw new Error('Tipo de aula no válido. Debe ser una cadena no vacía');
  }
  if (!isValidDayOfWeek(day)) {
    throw new Error('Día de la semana inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo');
  }
  if (!isValidTime(hour)) {
    throw new Error('Hora inválida. Formato requerido: HH:mm');
  }
  
  const [rows] = await pool.query('CALL pa_SelectProfesorEnAulaPorHora(?,?,?,?)', [numberClass, typeClass, day, hour]);  
  return rows[0] || null;
}; 