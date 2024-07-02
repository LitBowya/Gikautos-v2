import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
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
    }]
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
