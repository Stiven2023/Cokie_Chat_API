import { MessageModel, ChatModel } from '../models/chatModel.js';
import { io } from '../index.js';

// Crear un nuevo mensaje
export async function createMessage(req, res) {
  try {
    const { user_id, contentMessage, chatId } = req.body;
    console.log(user_id, contentMessage);
    const message = new MessageModel ({ sender: user_id, content: contentMessage });
    await message.save();
    
    // Agregar el ID del mensaje al chat correspondiente
    await ChatModel.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

    console.log(message);
    io.emit('newMessage', message); // Emitir evento de nuevo mensaje
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Obtener todos los mensajes
export async function getAllMessages(req, res) {
  try {
    const messages = await MessageModel.find();
    res.json(messages);
  } catch (error) {
    console.error("Error getting all messages:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Obtener un mensaje por su ID
export async function getMessageById(req, res) {
  try {
    const messageId = req.params.id;
    const message = await MessageModel.findById(messageId);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error("Error getting message by ID:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Actualizar un mensaje por su ID
export async function updateMessage(req, res) {
  try {
    const messageId = req.params.id;
    const { sender, content, createdAt, chatId } = req.body;
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { sender, content, createdAt, chatId },
      { new: true }
    );
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Eliminar un mensaje por su ID
export async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId);
    if (deletedMessage) {
      // Eliminar el ID del mensaje del chat correspondiente
      await ChatModel.findByIdAndUpdate(deletedMessage.chatId, { $pull: { messages: messageId } });
      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
