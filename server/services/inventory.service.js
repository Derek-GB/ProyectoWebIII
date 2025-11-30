import pool from './db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM vwGetAllInventario');
    return rows;
}

export const getById = async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('El ID debe ser un número entero positivo');
    }
    const [rows] = await pool.query('CALL pa_GetInventarioById(?)', [id]);
    if (rows[0].length === 0) {
        throw new Error('Inventario no encontrado');
    }
    return rows[0][0];
}

export const create = async (inventory) => {
    if (!inventory) {
        throw new Error('El inventario no puede estar vacío');
    }
    const {description, teamName, quantity, classroomId } = inventory;
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
    }
    if (typeof description !== 'string' || description.trim() === '') {
        throw new Error('La descripción debe ser una cadena no vacía');
    }
    if (typeof teamName !== 'string' || teamName.trim() === '') {
        throw new Error('El nombre debe ser una cadena no vacía');
    }
    if (!Number.isInteger(classroomId) || classroomId <= 0) {
        throw new Error('El ID del aula debe ser un número entero positivo');
    }
    const [result] = await pool.query('CALL pa_InsertInventario(?, ?, ?, ?)', [ classroomId, teamName, description, quantity]);
    return { message: 'Inventario agregado exitosamente' };
}

export const update = async (id, inventory) => {
    if (!inventory) {
        throw new Error('El inventario no puede estar vacío');
    }
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('El ID debe ser un número entero positivo');
    }
    let {description, teamName, quantity, classroomId } = inventory;
    if (!description || !teamName || !quantity || !classroomId) {
        original = await getById(id);
        for (const key in original) {
            if (!inventory[key]) {
                inventory[key] = original[key];
            }
        }
        description = inventory.description;
        teamName = inventory.teamName;
        quantity = inventory.quantity;
        classroomId = inventory.classroomId;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
    }
    if (typeof description !== 'string' || description.trim() === '') {
        throw new Error('La descripción debe ser una cadena no vacía');
    }
    if (typeof teamName !== 'string' || teamName.trim() === '') {
        throw new Error('El nombre debe ser una cadena no vacía');
    }
    if (!Number.isInteger(classroomId) || classroomId <= 0) {
        throw new Error('El ID del aula debe ser un número entero positivo');
    }
    const [result] = await pool.query('CALL pa_UpdateInventario(?, ?, ?, ?, ?)', [ id, classroomId, teamName, description, quantity]);
    if (result.affectedRows === 0) {
        throw new Error('Inventario no encontrado');
    }
    return { message: 'Inventario actualizado exitosamente' };
}

export const deleteById = async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('El ID debe ser un número entero positivo');
    }
    const [result] = await pool.query('CALL pa_DeleteInventario(?)', [id]);
    if (result.affectedRows === 0) {
        throw new Error('Inventario no encontrado');
    }
    return { message: 'Inventario eliminado exitosamente' };
}