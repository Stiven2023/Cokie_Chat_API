import { MessageModel } from '../models/chatModel.js';
import { io } from '../index.js';

export async function createMessage(req, res) {
  try {
    const { sender, content, createdAt, chatId } = req.body;
    const message = await MessageModel.create({ sender, content, createdAt, chatId });
    
    // Actualiza el chat para incluir el mensaje
    await ChatModel.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

    io.emit('newMessage', message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getAllMessages(req, res) {
  try {
    const messages = await MessageModel.find();
    res.json(messages);
  } catch (error) {
    console.error("Error getting all messages:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
