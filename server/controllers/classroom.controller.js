import * as classroomService from '../services/classroom.service.js';
const types = ['laboratorio', 'aula'];

const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await classroomService.getAll();
        res.status(200).json(classrooms);
    } catch (err) {
        console.error('Error en consulta:', err);
        const code = err.message === 'No hay aulas disponibles' ? 404 : 500;
        res.status(code).json({ error: 'Error al obtener las aulas: ' + err.message });
    }
}

const getClassroomById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del aula es requerido' });
    }
    try {
        const classroom = await classroomService.getById(req.params.id);
        res.status(200).json(classroom);
    } catch (err) {
        console.error('Error en consulta:', err);
        const code = err.message === 'Aula no encontrada' ? 404 : 500;
        res.status(code).json({ error: 'Error al obtener el aula: ' + err.message });
    }
}

const getClassroomAvailables = async (req, res) => {
    if (!req.query) return res.status(400).json({ error: 'Parámetros de consulta son requeridos' });
    const { day, hour } = req.query;
    if (!day || !hour) return res.status(400).json({ error: 'Día y hora son requeridos' });
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    if (!days.includes(day)) {
        return res.status(400).json({ error: 'Día inválido. Los días permitidos son: ' + days.join(', ') });
    }
    const hourFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!hourFormat.test(hour)) {
        return res.status(400).json({ error: 'Hora inválida. El formato correcto es HH:MM en formato 24 horas.' });
    }
    try {
        const availableClassrooms = await classroomService.getAvailable(day, hour);
        res.status(200).json(availableClassrooms);
    } catch (err) {
        console.error('Error en consulta:', err);
        const code = err.message === 'No hay aulas disponibles' ? 404 : 500;
        res.status(code).json({ error: 'Error al obtener las aulas disponibles: ' + err.message });
    }
}

const postClassroom = async (req, res) => {
    if (!req.body || !req.body.name || !req.body.building || !req.body.type) {
        return res.status(400).json({ error: 'Datos incompletos para crear el aula' });
    }
    if (!types.includes(req.body.type)){
        return res.status(400).json({ error: 'Tipo de aula inválido. Los tipos permitidos son: ' + types.join(', ') });
    }
    try {
        const newClassroom = await classroomService.create({name: req.body.name, building: req.body.building, type: req.body.type});
        res.status(201).json(newClassroom);
    } catch (err) {
        console.error('Error al insertar:', err);
        const msg = err.message.toLowerCase();
        let code = 500;
        if (msg.includes('id') || msg.includes('cantidad') || msg.includes('cadena'))
            code = 400;
        res.status(code).json({ error: 'Error al agregar inventario: ' + err.message });
    }
}

const putClassroom = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del inventario es requerido' });
    }
    if (!req.body) {
        return res.status(400).json({ error: 'No se enviaron datos para actualizar el aula' });
    }
    const { name, building, type } = req.body;
    if (type && !types.includes(type)){
        return res.status(400).json({ error: 'Tipo de aula inválido. Los tipos permitidos son: ' + types.join(', ') });
    }
    if (name || building || type) {
        try {
            const updatedClassroom = await classroomService.update(req.params.id, { name, building, type });
            res.status(200).json(updatedClassroom);
        } catch (err) {
            console.error('Error al actualizar:', err);
            const msg = err.message.toLowerCase();
            let code = 500;
            if (msg.includes('id') || msg.includes('cantidad') || msg.includes('cadena'))
            code = 400;
            res.status(code).json({ error: 'Error al agregar inventario: ' + err.message });
        }
    } else {
        return res.status(400).json({ error: 'No se enviaron datos válidos para actualizar el aula' });
    }
}

const deleteClassroomById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del aula es requerido' });
    }
    try {
        const result = await classroomService.deleteById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al eliminar:', err);
        const code = err.message === 'Aula no encontrada' ? 404 : 500;
        res.status(code).json({ error: 'Error al eliminar el aula: ' + err.message });
    }
}

export default { getAllClassrooms, getClassroomById, getClassroomAvailables, postClassroom, putClassroom, deleteClassroomById };