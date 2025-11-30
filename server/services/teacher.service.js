import pool from "./db.js";

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM vwGetAllProfesor');
    return rows;
}

export const getById = async (id) => {
    const [rows] = await pool.query('CALL pa_GetProfesorById(?)', [id]);
    return rows[0][0];
}

export const create = async (teacher) => {
    if (!teacher) {
        throw new Error('El profesor no puede estar vacío');
    }   
    const [result] = await pool.query('CALL pa_InsertProfesor (?,?,?)', [teacher.nombre, teacher.correo , teacher.especialidad]);
    return { message: 'Profesor agregado exitosamente' };
}

export const update = async (id, teacher) => {
    if (!teacher) {
        throw new Error('El profesor no puede estar vacío');
    }
    const [result] = await pool.query('CALL pa_UpdateProfesor (?,?,?,?)', [id , teacher.nombre ?? null, teacher.correo ?? null, teacher.especialidad ?? null]);
    return { message: 'Profesor actualizado exitosamente' };
}

export const deleteById = async (id) => {
    const [result] = await pool.query('CALL pa_DeleteProfesor(?)', [id]);
    if (result.affectedRows === 0) {
        throw new Error('Profesor no encontrado');
    }
    return { message: 'Profesor eliminado exitosamente' };
}

export const getScheduleByTeacher = async (nombre) => {
    const [result] = await pool.query('CALL pa_GetHorariosByProfesor(?)', [nombre]);
    return result[0];
};