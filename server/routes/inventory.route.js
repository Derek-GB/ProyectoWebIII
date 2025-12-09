import express from 'express';
import InventoryController from '../controllers/inventory.controller.js';
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
router.get('/', allowRoles('admin', 'coordinador', 'consultor'), InventoryController.getAllInventories);

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
router.get('/:id', allowRoles('admin', 'coordinador', 'consultor'), InventoryController.getInventoryById);

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
router.post('/', allowRoles('admin'), InventoryController.postInventory);

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
router.put('/:id', allowRoles('admin'), InventoryController.putInventory);

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
router.delete('/:id', allowRoles('admin'), InventoryController.deleteInventoryById);

export default router;