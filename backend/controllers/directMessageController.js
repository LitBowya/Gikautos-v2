import DirectMessage from '../models/directMessageModel.js';
import Reply from '../models/replyModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

const sendDirectMessage = asyncHandler(async (req, res) => {
  const { content, recipientId } = req.body;
  const senderId = req.user._id;

  const directMessage = new DirectMessage({
    content,
    sentBy: senderId,
    sentTo: recipientId,
  });
  await directMessage.save();
  res.status(201).json(directMessage);
});

const editDirectMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const senderId = req.user._id;

  const directMessage = await DirectMessage.findById(messageId);
  if (!directMessage) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (!directMessage.sentBy.equals(senderId)) {
    res.status(403).json({ error: 'User not authorized to edit this message' });
    return;
  }

  directMessage.content = content;
  await directMessage.save();
  res.status(200).json(directMessage);
});

const deleteDirectMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const senderId = req.user._id;

  const directMessage = await DirectMessage.findById(messageId);
  if (!directMessage) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (!directMessage.sentBy.equals(senderId)) {
    res
      .status(403)
      .json({ error: 'User not authorized to delete this message' });
    return;
  }

  await directMessage.remove();
  res.status(204).send();
});

const reactToDirectMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { reaction } = req.body;
  const userId = req.user._id;

  const directMessage = await DirectMessage.findById(messageId);
  if (!directMessage) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (
    !directMessage.sentBy.equals(userId) &&
    !directMessage.sentTo.equals(userId)
  ) {
    res
      .status(403)
      .json({ error: 'User not authorized to react to this message' });
    return;
  }

  directMessage.reactions.push(reaction);
  await directMessage.save();
  res.status(200).json(directMessage);
});

const replyToDirectMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const directMessage = await DirectMessage.findById(messageId);
  if (!directMessage) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  if (
    !directMessage.sentBy.equals(userId) &&
    !directMessage.sentTo.equals(userId)
  ) {
    res
      .status(403)
      .json({ error: 'User not authorized to reply to this message' });
    return;
  }

  const reply = new Reply({ content, message: messageId, sentBy: userId });
  await reply.save();
  directMessage.replies.push(reply._id);
  await directMessage.save();
  res.status(201).json(reply);
});

const getDirectMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const recipientId = req.params.recipientId;

  const directMessages = await DirectMessage.find({
    $or: [
      { sentBy: userId, sentTo: recipientId },
      { sentBy: recipientId, sentTo: userId },
    ],
  })
    .populate('sentBy', 'name')
    .populate('sentTo', 'name');

  res.status(200).json(directMessages);
});

export {
  sendDirectMessage,
  editDirectMessage,
  deleteDirectMessage,
  reactToDirectMessage,
  replyToDirectMessage,
  getDirectMessages,
};
