import express from 'express';
import {
  sendDirectMessage,
  editDirectMessage,
  deleteDirectMessage,
  reactToDirectMessage,
  replyToDirectMessage,
  getDirectMessages,
} from '../controllers/directMessageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, sendDirectMessage);

router
  .route('/:messageId')
  .put(protect, editDirectMessage)
  .delete(protect, deleteDirectMessage);

router.route('/:messageId/react').post(protect, reactToDirectMessage);

router.route('/:messageId/reply').post(protect, replyToDirectMessage);

router.route('/user/:recipientId').get(protect, getDirectMessages);

export default router;
