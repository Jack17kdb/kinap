import express from 'express';
import protect from '../middleware/protect.js';
import chatController from '../controllers/chatController.js';

const router = express.Router();

router.get('/getchatusers', protect, chatController.getChatUsers);
router.get('/getmessages/:id', protect, chatController.getMessages);
router.post('/sendmessages/:id', protect, chatController.sendMessages);
router.delete('/deletemessages/:id', protect, chatController.deleteMessage);

export default router;