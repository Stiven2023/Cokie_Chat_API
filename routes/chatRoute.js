import express from 'express';
import { createChat, getAllChats, getChatById, updateChat, deleteChat, joinChat } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', getAllChats);
router.post('/', createChat);
router.post('/:id/join', joinChat);
router.get('/:id', getChatById); 
router.put('/:id', updateChat); 
router.delete('/:id', deleteChat); 

export default router;
