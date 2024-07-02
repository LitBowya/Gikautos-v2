import express from 'express';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  replyToMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:channelId/messages', protect, getMessages);
router.post('/:channelId/messages', protect, sendMessage);
router.route('/:messageId')
  .put(protect, editMessage)
  .delete(protect, deleteMessage);

router.route('/:messageId/react')
  .post(protect, reactToMessage);

router.route('/:messageId/reply')
  .post(protect, replyToMessage);

export default router;
