import express from 'express';
import { createChat, getAllChats, getChatById, updateChat, deleteChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', createChat);
router.get('/', getAllChats);
router.get('/:id', getChatById); 
router.put('/:id', updateChat); 
router.delete('/:id', deleteChat); 

export default router;
