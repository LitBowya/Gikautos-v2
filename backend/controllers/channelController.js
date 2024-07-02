import Channel from '../models/channelModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

const createChannel = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
      res.status(400).json({ error: 'Channel name is required' });
      return;
    }

    const channel = new Channel({
      name,
      members: [userId]
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const editChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { name } = req.body;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }

  channel.name = name;
  await channel.save();
  res.status(200).json(channel);
});

const deleteChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);

    console.log("This is the channel id", channel)

    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    await channel.deleteOne();
    res.json({ message: 'Channel removed' });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const joinChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }

  if (!channel.members.includes(userId)) {
    channel.members.push(userId);
    await channel.save();
  }

  res.status(200).json(channel);
});

const leaveChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }

  channel.members = channel.members.filter((member) => !member.equals(userId));
  await channel.save();

  res.status(200).json(channel);
});

const listChannels = asyncHandler(async (req, res) => {
   const channels = await Channel.find({});
   res.status(200).json(channels);
});

const getChannelMembers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await Channel.findById(channelId).populate('members', 'name');
  if (!channel) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }

  res.status(200).json(channel.members);
});

export {
  createChannel,
  editChannel,
  deleteChannel,
  joinChannel,
  leaveChannel,
  listChannels,
  getChannelMembers,
};
