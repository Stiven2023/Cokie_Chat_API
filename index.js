import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectToDatabase from './server/db.js';
import messageRoutes from './routes/messageRoute.js';
import chatRoutes from './routes/chatRoute.js';
import cors from 'cors'; // Importa el módulo cors

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Middleware para procesar JSON
app.use(express.json());

// Middleware para configurar CORS para aceptar solicitudes desde cualquier origen
app.use(cors());

// Rutas de mensajes y chats
app.use('/messages', messageRoutes);
app.use('/chats', chatRoutes);

// Conexión a MongoDB y inicio del servidor
connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
