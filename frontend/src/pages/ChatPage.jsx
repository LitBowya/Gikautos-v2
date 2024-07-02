import React, { useState } from 'react';
import ChannelList from '../components/ChatApp/ChannelList';
import MessageList from '../components/ChatApp/MessageList';
import DirectMessageList from '../components/ChatApp/DirectMessageList';
import ChannelMembers from '../components/ChatApp/ChannelMembers'; // Adjust the import path as necessary

const ChatPage = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleDirectMessage = (recipientId) => {
    // Handle direct message logic here, perhaps by showing/hiding DirectMessageList component
    console.log('Direct message to:', recipientId);
    setSelectedChannel(null); // Optionally clear selected channel
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <ChannelList onSelectChannel={handleChannelSelect} />
          {selectedChannel && (
            <ChannelMembers
              channelId={selectedChannel}
              onDirectMessageClick={handleDirectMessage}
            />
          )}
        </div>
        <div style={{ flex: 2 }}>
          {selectedChannel && <MessageList channelId={selectedChannel} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
