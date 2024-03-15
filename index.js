import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectToDatabase from './server/db.js';
import messageRoutes from './routes/messageRoute.js';
import chatRoutes from './routes/chatRoute.js';
import userRoutes from './routes/userRoute.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('A user connected');

  // Manejar evento cuando un cliente se une a un chat específico
  socket.on('joinChat', (chatId) => {
    console.log(`User ${socket.id} joined chat ${chatId}`);
    socket.join(chatId); // Unir al cliente al chat específico
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(express.json());

app.use(cors());

app.use('/messages', messageRoutes);
app.use('/chats', chatRoutes);
app.use('/users', userRoutes);

connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
