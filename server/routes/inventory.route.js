import express from 'express';
import * as inventoryService from '../services/inventory.service.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

/**  
 * @swagger  
 * tags:  
 *   name: Inventario  
 *   description: Gestión del inventario de equipo por aula  
 */
const router = express.Router();

/**
 * @swagger
 * /inventory:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener todos los inventarios
 *     description: Devuelve una lista completa de todos los inventarios registrados.
 *     responses:
 *       200:
 *         description: Lista de inventarios obtenida correctamente
 *       500:
 *         description: Error obteniendo los inventarios
 */
router.get('/', allowRoles('admin', 'coordinador', 'consultor'), async (req, res) => {
    try {
        const inventories = await inventoryService.getAll();
        res.status(200).json(inventories);
    } catch (err) {
        console.error('Error en consulta:', err);
        res.status(500).json({ error: 'Error al obtener los inventarios: ' + err.message });
    }
});

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     tags:
 *       - Inventario
 *     summary: Obtener inventario por ID
 *     description: Obtiene un registro de inventario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *       400:
 *         description: ID faltante
 *       404:
 *         description: Inventario no encontrado
 */
router.get('/:id', allowRoles('admin', 'coordinador', 'consultor'), async (req, res) => {
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
});

/**
 * @swagger
 * /inventory:
 *   post:
 *     tags:
 *       - Inventario
 *     summary: Crear un nuevo registro de inventario
 *     description: Inserta un inventario nuevo en el sistema.
 *     requestBody:
 *       description: Datos requeridos para crear el inventario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classroomId
 *               - teamName
 *               - description
 *               - quantity
 *             properties:
 *               classroomId:
 *                 type: integer
 *               teamName:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inventario creado exitosamente
 *       400:
 *         description: Datos incompletos
 *       500:
 *         description: Error creando inventario
 */
router.post('/', allowRoles('admin'), async (req, res) => {
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
});

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     tags:
 *       - Inventario
 *     summary: Actualizar inventario existente
 *     description: Modifica un registro de inventario por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Campos del inventario a modificar  
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classroomId:
 *                 type: integer
 *               teamName:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventario actualizado exitosamente
 *       400:
 *         description: ID faltante o datos inválidos
 *       500:
 *         description: Error actualizando inventario
 */
router.put('/:id', allowRoles('admin'), async (req, res) => {
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
});

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     tags:
 *       - Inventario
 *     summary: Eliminar inventario
 *     description: Elimina un registro de inventario por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario eliminado exitosamente
 *       400:
 *         description: ID faltante
 *       500:
 *         description: Error eliminando inventario
 */
router.delete('/:id', allowRoles('admin'), async (req, res) => {
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
});

export default router;