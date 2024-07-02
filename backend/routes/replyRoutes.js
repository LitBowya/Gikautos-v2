import express from 'express';
import {
  editReply,
  deleteReply,
  getReplies,
  replyToReply,
} from '../controllers/replyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getReplies);
router.put('/:replyId', protect, editReply);
router.delete('/:replyId', protect, deleteReply);
router.post('/:replyId/reply', protect, replyToReply);

export default router;
