import Model from '../models/inventory.model.js';

export const getAll = async () => {
  const rows = await Model.getAll();
  if (rows.length === 0) {
    throw new Error('No hay inventarios disponibles');
  }
  return rows;
};

export const getById = async (id) => {
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El ID debe ser un número entero positivo');
  }
  const rows = await Model.getById(id);
  if (rows[0].length === 0) {
    throw new Error('Inventario no encontrado');
  }
  return rows[0][0];
};

export const create = async (inventory) => {
  if (!inventory) {
    throw new Error('El inventario no puede estar vacío');
  }
  const { description, teamName } = inventory;
  const quantity = inventory.quantity !== undefined ? Number(inventory.quantity) : undefined;
  const classroomId = inventory.classroomId !== undefined ? Number(inventory.classroomId) : undefined;

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

  await Model.create(classroomId, teamName, description, quantity);
  return { message: 'Inventario agregado exitosamente' };
};

export const update = async (id, inventory) => {
  if (!inventory) {
    throw new Error('El inventario no puede estar vacío');
  }
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El ID debe ser un número entero positivo');
  }

  const { description, teamName } = inventory;
  const quantity = inventory.quantity !== undefined ? Number(inventory.quantity) : undefined;

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity <= 0)) {
    throw new Error('La cantidad debe ser un número positivo');
  }
  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    throw new Error('La descripción debe ser una cadena no vacía');
  }
  if (teamName !== undefined && (typeof teamName !== 'string' || teamName.trim() === '')) {
    throw new Error('El nombre debe ser una cadena no vacía');
  }

  const result = await Model.update(id, teamName, description, quantity);
  if (result.affectedRows === 0) {
    throw new Error('Inventario no encontrado');
  }
  return { message: 'Inventario actualizado exitosamente' };
};

export const deleteById = async (id) => {
  id = Number(id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El ID debe ser un número entero positivo');
  }
  const result = await Model.deleteById(id);
  if (result.affectedRows === 0) {
    throw new Error('Inventario no encontrado');
  }
  return { message: 'Inventario eliminado exitosamente' };
};
