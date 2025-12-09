import pool from "../services/db.js";

class Inventory {
  async getAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM vwGetAllInventario");
      return rows;
    } catch (err) {
      console.error("Error en consulta de getAll inventarios:", err);
      throw new Error("Error obteniendo los inventarios: " + err.message);
    }
  }

  async getById(id) {
    try {
      const [rows] = await pool.query("CALL pa_GetInventarioById(?)", [id]);
      return rows;
    } catch (err) {
      console.error("Error en consulta de getById inventario:", err);
      throw new Error("Error obteniendo el inventario: " + err.message);
    }
  }

  async create(classroomId, teamName, description, quantity) {
    try {
      const [result] = await pool.query(
        "CALL pa_InsertInventario(?, ?, ?, ?)",
        [classroomId, teamName, description, quantity]
      );
      return result;
    } catch (err) {
      console.error("Error en consulta de create inventario:", err);
      throw new Error("Error creando el inventario: " + err.message);
    }
  }

  async update(id, teamName, description, quantity) {
    try {
      const [result] = await pool.query(
        "CALL pa_UpdateInventario(?, ?, ?, ?)",
        [id, teamName, description, quantity]
      );
      return result;
    } catch (err) {
      console.error("Error en consulta de update inventario:", err);
      throw new Error("Error actualizando el inventario: " + err.message);
    }
  }

  async deleteById(id) {
    try {
      const [result] = await pool.query("CALL pa_DeleteInventario(?)", [id]);
      return result;
    } catch (err) {
      console.error("Error en consulta de delete inventario:", err);
      throw new Error("Error eliminando el inventario: " + err.message);
    }
  }
}

export default new Inventory();

