import InventoryService from '../services/inventory.service.js';

const getAllInventories = async (req, res) => {
    try {
        const inventories = await InventoryService.getAll();
        res.status(200).json(inventories);
    } catch (err) {
        console.error('Error en consulta:', err);
        res.status(500).json({ error: 'Error al obtener los inventarios: ' + err.message });
    }
}

const getInventoryById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del inventario es requerido' });
    }
    try {
        const inventory = await inventoryService.getById(req.params.id);
        res.status(200).json(inventory);
    } catch (err) {
        console.error('Error en consulta:', err);
        res.status(500).json({ error: 'Error al obtener el inventario: ' + err.message });
    }
}

const postInventory = async (req, res) => {
    if (!req.body || !req.body.classroomId || !req.body.teamName || !req.body.description || !req.body.quantity) {
        return res.status(400).json({ error: 'Datos incompletos para crear el inventario' });
    }
    try {
        const newInventory = await inventoryService.create({classroomId: req.body.classroomId, teamName: req.body.teamName, description: req.body.description, quantity: req.body.quantity});
        res.status(201).json(newInventory);
    } catch (err) {
        console.error('Error al insertar:', err);
        res.status(500).json({ error: 'Error al agregar inventario: ' + err.message });
    }
}

const putInventory = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del inventario es requerido' });
    }
    if (!req.body) {
        return res.status(400).json({ error: 'No se enviaron datos para actualizar el inventario' });
    }
    const { classroomId, teamName, description, quantity } = req.body;
    if (classroomId || teamName || description || quantity) {
        try {
            const updatedInventory = await inventoryService.update(req.params.id, { classroomId, teamName, description, quantity });
            res.status(200).json(updatedInventory);
        } catch (err) {
            console.error('Error al actualizar:', err);
            res.status(500).json({ error: 'Error al actualizar el inventario: ' + err.message });
        }
    } else {
        return res.status(400).json({ error: 'No se enviaron datos válidos para actualizar el inventario' });
    }
}

const deleteInventoryById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: 'ID del inventario es requerido' });
    }
    try {
        const result = await inventoryService.deleteById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al eliminar:', err);
        res.status(500).json({ error: 'Error al eliminar el inventario: ' + err.message });
    }
}

export default { getAllInventories, getInventoryById, postInventory, putInventory, deleteInventoryById };