import * as usersService from '../services/user.service.js';

export const getAll = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.json(users);
  } catch (err) {
    console.error('Error en consulta:', err.message || err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const getById = async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error('Error en consulta:', err.message);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

export const create = async (req, res) => {
  try {
    const newUser = await usersService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message === 'El usuario no puede estar vacío' || err.message.includes('obligatorios')) {
      return res.status(400).json({ error: err.message });
    }

    console.error('Error al insertar:', err);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await usersService.update(id, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);

    if (err.message === 'El usuario no existe') {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    if (err.message.includes('vacío') || err.message.includes('proporcionar')) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const result = await usersService.changePassword(id, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error al actualizar contraseña:', err.message);

    if (err.message === 'El usuario no existe') {
      return res.status(404).json({ error: err.message });
    }

    if (err.message === 'La contraseña actual es incorrecta') {
      return res.status(401).json({ error: err.message });
    }

    if (err.message.includes('Debes proporcionar')) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersService.deleteById(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.error('Error al eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
