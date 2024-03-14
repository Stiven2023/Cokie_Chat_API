import express from 'express';
import { registerUser, loginUser, logoutUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;