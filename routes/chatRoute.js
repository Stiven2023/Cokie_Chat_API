import express from 'express';
import { createChat, getAllChats } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', createChat);
router.get('/', getAllChats);

export default router;