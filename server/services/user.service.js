import pool from './db.js';
import bcrypt from 'bcrypt';

export const getAll = async () => {
  const [rows] = await pool.execute('SELECT * FROM vwGetAllUsuario');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.query('CALL pa_GetUsuarioById(?)', [id]);  
  return rows[0][0];
};

export const create = async (user) => {
  if (!user) {
    throw new Error('El usuario no puede estar vacío');
  }

  const { nombre, email, password, role } = user;

  
  if (!nombre || !email || !password) {
    throw new Error('Nombre, email y contraseña son obligatorios');
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const params = [
    nombre,               
    email,              
    hashedPassword,     
    role ?? null        
  ];

  const [result] = await pool.query(
    'CALL pa_InsertUsuario(?,?,?,?)',
    params
  );

  return { 
    message: 'Usuario agregado exitosamente'

  };
};
export const validateCredentials = async (name, password) => {
  const [result] = await pool.query(
    'CALL pa_GetUsuarioPorNombre(?)',
    [name]
  );
  const rows = result[0]; 
  if (!rows || rows.length === 0) return null;
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  delete user.passwordHash;
  return user;
};

export const update = async (id, user) => {
  if (!user) {
    throw new Error('El usuario no puede estar vacío');
  }
  const [rows] = await pool.execute(
    'CALL pa_GetUsuarioById(?)',
    [id]
  );

  if (rows.length === 0) {
    throw new Error('El usuario no existe');
  }
  let hashedPassword = null;
  if (user.password) {
    hashedPassword = await bcrypt.hash(user.password, 10);
  }
  const [result] = await pool.query(
    'CALL pa_UpdateUsuario(?,?,?,?)',
    [
      id,
      user.email ?? null,
      hashedPassword,
      user.role ?? null
    ]
  );

  return { message: 'Usuario actualizado exitosamente' };

};

export const changePassword = async (id, currentPassword, newPassword) => {
  if (!id || !currentPassword || !newPassword) {
    throw new Error('Debes proporcionar ID, contraseña actual y nueva contraseña');
  }

  const [rows] = await pool.query(
    'CALL pa_GetUsuarioPasswordById(?)',
    [id]
  );

  const userRow = rows[0]?.[0];

  if (!userRow) {
    throw new Error('El usuario no existe');
  }

  const hash = userRow.passwordHash;

  if (!hash) {
    throw new Error('No se encontró el hash de la contraseña en el usuario');
  }

  const isValid = await bcrypt.compare(currentPassword, hash);
  if (!isValid) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    'CALL pa_UpdateUsuario(?, ?, ?, ?)',
    [id, null, newHashedPassword, null] 
  );

  return { message: 'Contraseña actualizada correctamente' };
};



  export const deleteById = async (id) => {
  if (!id) {
    throw new Error('El ID no puede estar vacío');
  }
  const [result] = await pool.execute('CALL pa_DeleteUsuario(?)', [id]);
  return { message: 'User deleted successfully' };

};