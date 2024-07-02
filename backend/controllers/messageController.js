import Message from "../models/messageModel.js";
import Channel from "../models/channelModel.js";
import Reply from "../models/replyModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const isUserInChannel = async (channelId, userId) => {
  // console.log("Checking if user is in channel:", channelId, userId);
  const channel = await Channel.findById(channelId);
  if (!channel) {
    // console.error(`Channel not found for channelId: ${channelId}`);
    throw new Error("Channel not found");
  }
  if (!channel.members.includes(userId)) {
    // console.error(`User ${userId} is not a member of channel ${channelId}`);
    throw new Error("User is not a member of this channel");
  }
  // console.log("User is in channel.");
};

const getMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  await isUserInChannel(channelId, userId);

  try {
    const messages = await Message.find({ channel: channelId })
      .populate({
        path: "replies",
        populate: {
          path: "sentBy",
          select: "username profilePicture",
        },
      })
      .populate({
        path: "replies",
        populate: {
          path: "replies",
          populate: {
            path: "sentBy",
            select: "username profilePicture",
          },
        },
      })
      .populate("sentBy", "username profilePicture")
      .populate("reactions.user", "username")
      .exec();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


const sendMessage = asyncHandler(async (req, res) => {
  // console.log("Sending message...");
  const { content, channelId } = req.body;
  const userId = req.user._id;

  try {
    await isUserInChannel(channelId, userId);

    const message = new Message({
      content,
      channel: channelId,
      sentBy: userId,
    });

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: message._id },
    });
    await message.save();

    // console.log("Message sent:", message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const editMessage = asyncHandler(async (req, res) => {
  // console.log("Editing message...");
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    // console.log("Message not found.");
    return res.status(404).json({ error: "Message not found" });
  }
  if (!message.sentBy.equals(userId)) {
    // console.log("User not authorized to edit this message.");
    return res.status(403).json({ error: "User not authorized to edit this message" });
  }

  message.content = content;
  await message.save();
  // console.log("Message edited:", message);
  res.status(200).json(message);
});

const deleteMessage = asyncHandler(async (req, res) => {
  console.log("Deleting message...");
  const { messageId } = req.params;
  console.log(messageId)
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    console.log("Message not found.");
    res.status(404).json({ error: "Message not found" });
    return;
  }
  if (!message.sentBy.equals(userId)) {
    console.log("User not authorized to delete this message.");
    res
      .status(403)
      .json({ error: "User not authorized to delete this message" });
    return;
  }

  await message.deleteOne();
  console.log("Message deleted.");
  res.status(204).json({message: "Delete successfully"});
});

const reactToMessage = asyncHandler(async (req, res) => {
  console.log("Reacting to message...");
  const { messageId } = req.params;
  const { reaction } = req.body;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    console.log("Message not found.");
    return res.status(404).json({ error: "Message not found" });
  }

  const channel = await Channel.findById(message.channel);
  if (!channel.members.includes(userId)) {
    console.log("User is not a member of this channel.");
    return res.status(403).json({ error: "User is not a member of this channel" });
  }

  // Check if user already reacted
  const existingReaction = message.reactions.find(reacted => reacted.user.equals(userId));
  if (existingReaction) {
    existingReaction.reaction = reaction; // Update existing reaction
  } else {
    message.reactions.push({ user: userId, reaction }); // Add new reaction
  }

  await message.save();
  console.log("Reaction added to message:", message);
  res.status(200).json(message);
});


const replyToMessage = asyncHandler(async (req, res) => {
  console.log("Replying to message...");
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  console.log(`This is the messageId ${messageId}`)
  console.log(`This is the content ${content}`)
  console.log(`This is the userId ${userId}`)
  
  const message = await Message.findById(messageId);
  console.log(`This is the message ${message}`)
  if (!message) {
    console.log("Message not found.");
    res.status(404).json({ error: "Message not found" });
    return;
  }

  const channel = await Channel.findById(message.channel);
  if (!channel.members.includes(userId)) {
    console.log("User is not a member of this channel.");
    res.status(403).json({ error: "User is not a member of this channel" });
    return;
  }

  const reply = new Reply({ content, message: messageId, sentBy: userId });
  await reply.save();
  message.replies.push(reply._id);
  await message.save();
  // console.log("Reply added:", reply);
  res.status(201).json(reply);
});

export {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  replyToMessage,
};
