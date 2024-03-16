import { MessageModel, ChatModel } from '../models/chatModel.js';
import { io } from '../index.js';

const messageSocketController = (socket) => {
  console.log("User connected to message socket");

  socket.on("send_message", async (messageData) => {
    try {
      const { user_id, contentMessage, chatId } = messageData;
      const message = new MessageModel({ sender: user_id, content: contentMessage });
      await message.save();

      // Actualizar el chat con el nuevo mensaje
      await ChatModel.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

      // Emitir evento de nuevo mensaje
      io.emit('newMessage', message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from message socket");
    // Lógica para manejar la desconexión del usuario
  });
};

export default messageSocketController;

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
