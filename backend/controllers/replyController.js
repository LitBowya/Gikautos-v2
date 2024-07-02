import Reply from "../models/replyModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Edit Reply
const editReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const { content } = req.body;

  try {
    const reply = await Reply.findByIdAndUpdate(
      replyId,
      { content },
      { new: true }
    );
    res.status(200).json(reply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Reply
const deleteReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;

  try {
    await Reply.findByIdAndDelete(replyId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// React to Reply
const reactToReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const { reaction } = req.body;

  try {
    const reply = await Reply.findByIdAndUpdate(
      replyId,
      { $push: { reactions: reaction } },
      { new: true }
    );
    res.status(200).json(reply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getReplies = asyncHandler(async (req, res) => {
  try {
    const replies = await Reply.find()
      .populate({
        path: "replies",
        populate: { path: "replies", populate: { path: "sentBy" } }, // Populate nested replies and their authors
      })
      .populate("sentBy")
      .exec();
    res.status(200).json(replies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const replyToReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const { content, sentBy, message } = req.body;

  // Validate input
  if (!content || !sentBy || !message) {
    console.log(
      "Validation failed: Content, sentBy, and message are required."
    );
    return res
      .status(400)
      .json({ error: "Content, sentBy, and message are required." });
  }

  try {
    // Create new reply
    const newReply = await Reply.create({ content, sentBy, message });
    console.log("New reply created:", newReply);

    // Update parent reply with the new reply's ID
    const parentReply = await Reply.findByIdAndUpdate(
      replyId,
      { $push: { replies: newReply._id } },
      { new: true }
    );

    // Check if parent reply exists
    if (!parentReply) {
      console.log("Parent reply not found for replyId:", replyId);
      return res.status(404).json({ error: "Parent reply not found." });
    }

    console.log("Parent reply updated:", parentReply);
    res.status(201).json(newReply);
  } catch (error) {
    console.log("Error creating reply to reply:", error.message);
    res.status(400).json({ error: error.message });
  }
});

export { editReply, deleteReply, reactToReply, replyToReply, getReplies };
