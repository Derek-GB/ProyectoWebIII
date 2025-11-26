import pool from './db.js'; 

export const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM vwGetAllHorario');  
  return rows;
};

export const create = async () => {
  if (!task || !task.trim() || !user || user <= 0) {
    throw new Error('La tarea o el usuario no pueden estar vacíos');
  }
  const [result] = await pool.execute('INSERT INTO tasks (task, completed, user_id) VALUES (?, 0, ?)', [task.trim(), user]);
  const [newTask] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
  return newTask[0];
};

export const update = async (id, updates) => {
  let query, params;
  if (updates.task !== undefined) {  // 'tarea' -> 'task'
    query = 'UPDATE tasks SET task = ? WHERE id = ?';
    params = [updates.task, id];
  } else if (updates.completed !== undefined) {  // 'completada' -> 'completed'
    query = 'UPDATE tasks SET completed = ? WHERE id = ?';
    params = [updates.completed ? 1 : 0, id];
  } else {
    throw new Error('Debe proporcionar "task" o "completed"');  // Ajusta mensaje
  }
  const [result] = await pool.execute(query, params);
  if (result.affectedRows === 0) {
    throw new Error('Task not found');
  }
  const [updated] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
  return updated[0];
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error('Task not found');
  }
  return { message: 'Task deleted successfully' };
};