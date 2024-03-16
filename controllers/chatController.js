import { ChatModel } from '../models/chatModel.js';
import { io } from '../index.js';

const chatSocketController = (socket) => {
  console.log("User connected to chat socket");

  socket.on("join", (chatId) => {
    console.log(`User joined chat ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from chat socket");
  });
};

export default chatSocketController;

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

async function getAllChats(req, res) {
  try {
    const chats = await ChatModel.find().populate({
      path: 'messages',
      populate: {
        path: 'sender',
        select: 'username' // Selecciona el campo 'username' del remitente
      }
    });
    res.json(chats);
  } catch (error) {
    console.error("Error getting all chats:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function joinChat(req, res) {
  try {
    const chatId = req.params.id;

    io.emit('userJoined', { chatId, userId: req.userId }); 

    res.status(200).json({ message: 'Joined chat successfully' });
  } catch (error) {
    console.error("Error joining chat:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getChatById(req, res) {
  try {
    const chatId = req.params.id;
    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateChat(req, res) {
  try {
    const chatId = req.params.id;
    const updateData = req.body;
    const updatedChat = await ChatModel.findByIdAndUpdate(chatId, updateData, { new: true });

    if (!updatedChat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    io.emit('chatUpdated', updatedChat);

    res.json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteChat(req, res) {
  try {
    const chatId = req.params.id;
    const deletedChat = await ChatModel.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    io.emit('chatDeleted', chatId);

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { createChat, getAllChats, getChatById, updateChat, deleteChat, joinChat };
