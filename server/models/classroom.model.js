import pool from "../services/db.js";

class Classroom {
  async getAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM vwGetAllAula");
      return rows;
    } catch (err) {
      console.error("Error en consulta de getAll aulas:", err);
      throw new Error("Error obteniendo las aulas: " + err.message);
    }
  }

  async getById(id) {
    try {
      const [rows] = await pool.query("CALL pa_GetAulaById(?)", [id]);
      return rows;
    } catch (err) {
      console.error("Error en consulta de getById aula:", err);
      throw new Error("Error obteniendo el aula: " + err.message);
    }
  }

  async getAvailable(day, hour) {
    try {
      const [rows] = await pool.query("CALL pa_GetAulasDisponibles(?, ?)", [day, hour]);
      return rows;
    } catch (err) {
      console.error("Error en consulta de getAvailable aulas:", err);
      throw new Error("Error obteniendo aulas disponibles: " + err.message);
    }
  }

  async create(name, building, type) {
    try {
      const [result] = await pool.query("CALL pa_InsertAula(?, ?, ?)", [name, building, type]);
      return result;
    } catch (err) {
      console.error("Error en consulta de create aula:", err);
      throw new Error("Error creando el aula: " + err.message);
    }
  }

  async update(id, name, building, type) {
    try {
      const [result] = await pool.query("CALL pa_UpdateAula(?, ?, ?, ?)", [id, name, building, type]);
      return result;
    } catch (err) {
      console.error("Error en consulta de update aula:", err);
      throw new Error("Error actualizando el aula: " + err.message);
    }
  }

  async deleteById(id) {
    try {
      const [result] = await pool.query("CALL pa_DeleteAula(?)", [id]);
      return result;
    } catch (err) {
      console.error("Error en consulta de delete aula:", err);
      throw new Error("Error eliminando el aula: " + err.message);
    }
  }
}

export default new Classroom();
