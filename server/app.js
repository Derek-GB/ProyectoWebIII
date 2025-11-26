import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRoutes from './routes/tasksRoutes.js'; 
import usersRoutes from './routes/usersRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import pool from './services/db.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/api/tasks', tasksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/schedule', scheduleRoutes);

// Probar conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a Railway');
    connection.release();
  } catch (err) {
    console.error('Error conectando a la DB:', err);
  }
})();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});