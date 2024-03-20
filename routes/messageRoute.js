import express from 'express';
import { createMessage, getAllMessages, getMessageById, updateMessage, deleteMessage } from '../controllers/messagesController.js';

const router = express.Router();

router.get('/', getAllMessages); 
router.post('/', createMessage);
router.get('/:id', getMessageById); 
router.put('/:id', updateMessage); 
router.delete('/:id', deleteMessage); 

export default router;
