import scheduleModel from '../models/schedule.model.js';

const isValidId = (id) => id && Number.isInteger(Number(id)) && Number(id) > 0;
const isValidTime = (time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const isValidDayOfWeek = (day) => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo','Miercoles','Sabado','lunes','martes','miércoles','jueves','viernes','sábado','domingo','miercoles','sabado'].includes(day);

export const getAll = async () => {
  return await scheduleModel.getAll();
};

export const getById = async (id) => {
  if (!isValidId(id)) {
    throw new Error('ID de horario inválido. Debe ser un número entero positivo');
  }
  const result = await scheduleModel.getById(id);
  if (!result) {
    throw new Error('Horario no encontrado');
  }
  return result;
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
  
  await scheduleModel.create(schedule);
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
  
  const result = await scheduleModel.update(id, schedule);
  if (result.affectedRows === 0) {
    throw new Error('Horario no encontrado');
  }
  return { message: 'Horario actualizado exitosamente' };
};

export const deleteById = async (id) => {
  if (!isValidId(id)) {
    throw new Error('ID de horario inválido. Debe ser un número entero positivo');
  }
  const result = await scheduleModel.delete(id);
  if (result.affectedRows === 0) {
    throw new Error('Horario no encontrado');
  }
  return { message: 'Horario eliminado exitosamente' };
};

export const getScheduleByTeacherAndDay = async (teacher,day,hour) => {
  if (!teacher || typeof teacher !== 'string' || teacher.trim() === '') {
    throw new Error('Nombre de profesor inválido. Debe ser una cadena no vacía');
  }
  if (!isValidDayOfWeek(day)) {
    throw new Error('Día de la semana inválido. Debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo');
  }
  if (!isValidTime(hour)) {
    throw new Error('Hora inválida. Formato requerido: HH:mm');
  }
  
  return await scheduleModel.getScheduleByTeacherAndDay(teacher, day, hour);
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
  
  return await scheduleModel.getScheduleByCourseAndDay(course, day, hour);
};

export const getClassByCourseAndDay = async (teacher,numberClass,typeClass) => {
  if (!teacher || typeof teacher !== 'string' || teacher.trim() === '') {
    throw new Error('Nombre de profesor inválido. Debe ser una cadena no vacía');
  }
  if (!numberClass || typeof numberClass !== 'string' || numberClass.trim() === '') {
    throw new Error('Número de aula no válido. Debe ser una cadena no vacía');
  }
  if (!typeClass || typeof typeClass !== 'string' || typeClass.trim() === '') {
    throw new Error('Tipo de aula no válido. Debe ser una cadena no vacía');
  }
  
  return await scheduleModel.getClassByCourseAndDay(teacher, numberClass, typeClass);
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
  
  return await scheduleModel.getTeacherByClassAndDay(numberClass, typeClass, day, hour);
}; 

export const deleteAll = async (verification) => {
  if (!verification || typeof verification !== 'string' || verification.toLowerCase() !== 'si') {
    return { message: 'No se borrará nada. Envía "si" como parámetro para confirmar el borrado.' };
  }
  const result = await scheduleModel.deleteAll();
  if (result.affectedRows === 0) {
    throw new Error('No se eliminaron registros');
  }
  return { message: 'Horarios eliminados exitosamente' };
};
