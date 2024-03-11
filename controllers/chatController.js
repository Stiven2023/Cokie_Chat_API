import { ChatModel } from '../models/chatModel.js';
import { io } from '../index.js';

async function createChat(req, res) {
  try {
    const { participantNames, users, messages } = req.body;
    const chat = await ChatModel.create({ participantNames, users, messages });

    io.emit('newChat', chat);

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Get all chats
async function getAllChats(req, res) {
  try {
    const chats = await ChatModel.find();
    res.json(chats);
  } catch (error) {
    console.error("Error getting all chats:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { createChat, getAllChats };