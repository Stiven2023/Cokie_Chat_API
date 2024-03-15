import express from 'express';
import { registerUser, loginUser, logoutUser, getAllUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

router.get('/get', getAllUsers);
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;