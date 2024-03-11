// controllers/messageController.js
import { MessageModel } from '../models/chatModel.js';
import { io } from '../index.js';

// Create a new message
export async function createMessage(req, res) {
  try {
    const { sender, content, mediaURL } = req.body;
    const message = await MessageModel.create({ sender, content, mediaURL });

    // Emitir un evento de Socket.IO para notificar a los clientes sobre el nuevo mensaje
    io.emit('newMessage', message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get all messages
export async function getAllMessages(req, res) {
  try {
    const messages = await MessageModel.find();
    res.json(messages);
  } catch (error) {
    console.error("Error getting all messages:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
