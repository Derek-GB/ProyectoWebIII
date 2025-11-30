import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/user.route.js';
import scheduleRoutes from './routes/schedule.route.js';
import teachersRoutes from './routes/teacher.route.js';
import classroomRoutes from './routes/classroom.route.js';
import inventoryRoutes from './routes/inventory.route.js';
import pool from './services/db.js';
import swagger from './utils/swagger.util.js';
import authRoutes from './routes/auth.route.js';
import { verifyToken } from './middlewares/authMiddleware.js';
import { allowRoles } from './middlewares/roleMiddleware.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({origin: "*", methods: ["GET", "POST", "PUT", "DELETE"]}));
app.use(express.json());

// Montar rutas
app.use('/api/auth', authRoutes);
app.use("/api/docs",swagger.serve,swagger.setup);

app.use('/api/users', verifyToken, allowRoles('admin') ,usersRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/teachers',teachersRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/inventory', inventoryRoutes);
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
export default app;