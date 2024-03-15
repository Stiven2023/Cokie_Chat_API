import { ChatModel } from '../models/chatModel.js';
import { MessageModel } from '../models/chatModel.js';
import { io } from '../index.js';

async function createChat(req, res) {
  try {
    const { participantNames, users, messages } = req.body;
    const chat = await ChatModel.create({ participantNames, users, messages });

    io.emit('newChat', chat); // Emitir evento de nuevo chat

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getAllChats(req, res) {
  try {
    const chats = await ChatModel.find();
    const chatsWithMessages = await Promise.all(chats.map(async (chat) => {
      const chatObj = chat.toObject();
      chatObj.messages = await MessageModel.find({ _id: { $in: chat.messages } });
      return chatObj;
    }));
    res.json(chatsWithMessages);
  } catch (error) {
    console.error("Error getting all chats:", error);
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
    const chatWithMessages = await populateChatWithMessages(chat);
    res.json(chatWithMessages);
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
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function populateChatWithMessages(chat) {
  const chatObj = chat.toObject();
  chatObj.messages = await MessageModel.find({ _id: { $in: chat.messages } });
  return chatObj;
}

// Agregar función para enviar mensajes a un chat existente
async function sendMessageToChat(chatId, message) {
  try {
    // Actualizar el chat con el nuevo mensaje
    const updatedChat = await ChatModel.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }
    }, { new: true });

    // Emitir evento para el chat actualizado
    io.emit('chatUpdated', updatedChat);

    return updatedChat;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    throw error;
  }
}

export { createChat, getAllChats, getChatById, updateChat, deleteChat, sendMessageToChat };
