import { ChatModel } from '../models/chatModel.js';
import { MessageModel } from '../models/chatModel.js';

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

async function getChats(req, res) {
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

export { createChat, getAllChats };
