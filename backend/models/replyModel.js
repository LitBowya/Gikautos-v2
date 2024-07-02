import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
    reactions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reaction: { type: String }
    }],
  },
  { timestamps: true }
);

export default mongoose.model('Reply', replySchema);
