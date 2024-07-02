import express from 'express';
import {
  createChannel,
  editChannel,
  deleteChannel,
  joinChannel,
  leaveChannel,
  listChannels,
  getChannelMembers,
} from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createChannel).get(protect, listChannels);
router
  .route('/:channelId')
  .put(protect, editChannel)
  .delete(protect, deleteChannel);
  router.get('/:channelId/members', protect, getChannelMembers);
router.route('/:channelId/join').post(protect, joinChannel);
router.route('/:channelId/leave').post(protect, leaveChannel);

export default router;
