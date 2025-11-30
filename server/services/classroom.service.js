import pool from "./db.js";

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM vwGetAllAula');
    return rows;
}

export const getById = async (id) => {
    id = Number(id);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('El ID debe ser un número entero positivo');
    }
    const [rows] = await pool.query('CALL pa_GetAulaById(?)', [id]);
    if (rows[0].length === 0) {
        throw new Error('Aula no encontrada');
    }
    return rows[0][0];
}


export const getAvailable = async (day, hour) => {
    const [h, m] = hour.split(':').map(x => parseInt(x));
    if (h < 8 || h > 21 || h === 12) {
        throw new Error('La hora debe estar entre 08:00 y 21:30; excluyendo el mediodía (12:00)');
    }
    const [rows] = await pool.query('CALL pa_GetAulasDisponibles(?,?)', [day, hour]);
    return rows;
}

export const create = async (classroom) => {
    if (!classroom) {
        throw new Error('El aula no puede estar vacía');
    }
    const {name, building, type } = classroom;
    if (typeof building !== 'string' || building.trim() === '') {
        throw new Error('El edificio debe ser una cadena no vacía');
    }
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('El nombre debe ser una cadena no vacía');
    }
    const [result] = await pool.query('CALL pa_InsertAula(?, ?, ?)', [ name, building, type]);
    return { message: 'Aula agregada exitosamente' };
}

export const update = async (id, classroom) => {
    if (!classroom) {
        throw new Error('El aula no puede estar vacía');
    }
    id = Number(id);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('El ID debe ser un número entero positivo');
    }
    let {name, building, type } = classroom;
    if (!name || !building || !type) {
        original = await getById(id);
        for (const key in original) {
            if (!classroom[key]) {
                classroom[key] = original[key];
            }
        }
        name = classroom.name;
        building = classroom.building;
        type = classroom.type;
    }
    if (typeof building !== 'string' || building.trim() === '') {
        throw new Error('El edificio debe ser una cadena no vacía');
    }
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('El nombre debe ser una cadena no vacía');
    }
    
    const [result] = await pool.query('CALL pa_UpdateAula(?, ?, ?, ?)', [ id, name, building, type]);
    if (result.affectedRows === 0) {
        throw new Error('Aula no encontrada');
    }
    return { message: 'Aula actualizada exitosamente' };
}

export const deleteById = async (id) => {
    id = Number(id);
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('El ID debe ser un número entero positivo');
    }
    const [result] = await pool.query('CALL pa_DeleteInventario(?)', [id]);
    if (result.affectedRows === 0) {
        throw new Error('Aula no encontrada');
    }
    return { message: 'Aula eliminada exitosamente' };
}