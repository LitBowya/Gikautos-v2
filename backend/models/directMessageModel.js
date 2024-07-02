import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reactions: [{ type: String }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  },
  { timestamps: true }
);

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;
