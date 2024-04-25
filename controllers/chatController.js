import { ChatModel } from '../models/chatModel.js';
import { User } from '../models/userModel.js';
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
    const { users, name } = req.body;

    console.log(users, name);

    const usernames = await Promise.all(
      users.map(async (userId) => {
        try {
          const user = await User.findById(userId);
          return user ? user.username : 'Unknown User';
        } catch (error) {
          console.error(`Error fetching username for userId: ${userId}`, error);
          return 'Unknown User';
        }
      })
    );

    const chat = await ChatModel.create({ users, participantNames: usernames, name: name});

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
        select: 'username avatar'
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
    const userId = req.params.userid;
    const chatId = req.params.chatid;

    // Verificar si el usuario existe
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar si el chat existe
    const chat = await ChatModel.findById(chatId).populate('messages');
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Si el usuario y el chat existen, emitir el evento y responder con éxito
    io.emit('userJoined', { chatId, userId });
    
    // Enviar los mensajes del chat al cliente
    res.status(200).json({ message: 'Joined chat successfully', messages: chat.messages });
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
    const chatWithMessages = await ChatModel.findById(chatId).populate('messages');
    res.json(chatWithMessages);
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateChat(req, res) {
  try {
    const chatId = ObjectId(req.params.id); // Convierte el chatId de String a ObjectId
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
    const chatId = req.params.id; // Convierte el chatId de String a ObjectId
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
