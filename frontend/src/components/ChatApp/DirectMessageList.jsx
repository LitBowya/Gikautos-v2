// src/components/DirectMessageList.js

import React, { useState } from 'react';
import {
  useGetDirectMessagesQuery,
  useSendDirectMessageMutation,
  useEditDirectMessageMutation,
  useDeleteDirectMessageMutation,
  useReactToDirectMessageMutation,
  useReplyToDirectMessageMutation,
} from '../../slices/directMessageSlice';

const DirectMessageList = ({ recipientId }) => {
  const {
    data: directMessages,
    isLoading,
    isError,
  } = useGetDirectMessagesQuery(recipientId);
  const [sendDirectMessage] = useSendDirectMessageMutation();
  const [editDirectMessage] = useEditDirectMessageMutation();
  const [deleteDirectMessage] = useDeleteDirectMessageMutation();
  const [reactToDirectMessage] = useReactToDirectMessageMutation();
  const [replyToDirectMessage] = useReplyToDirectMessageMutation();

  const [newDirectMessage, setNewDirectMessage] = useState('');

  const handleSend = () => {
    sendDirectMessage({ content: newDirectMessage, recipient: recipientId });
    setNewDirectMessage('');
  };

  const handleEdit = (messageId, newContent) => {
    editDirectMessage({ messageId, content: newContent });
  };

  const handleDelete = (messageId) => {
    deleteDirectMessage(messageId);
  };

  const handleReact = (messageId, reaction) => {
    reactToDirectMessage({ messageId, reaction });
  };

  const handleReply = (messageId, replyContent) => {
    replyToDirectMessage({ messageId, content: replyContent });
  };

  if (isLoading) return <div>Loading direct messages...</div>;
  if (isError) return <div>Error loading direct messages</div>;

  return (
    <div>
      <h2>Direct Messages</h2>
      <input
        type='text'
        value={newDirectMessage}
        onChange={(e) => setNewDirectMessage(e.target.value)}
        placeholder='Type a new message'
      />
      <button onClick={handleSend}>Send</button>
      <ul>
        {directMessages.map((message) => (
          <li key={message._id}>
            {message.content}
            <button onClick={() => handleEdit(message._id, 'Updated content')}>
              Edit
            </button>
            <button onClick={() => handleDelete(message._id)}>Delete</button>
            <button onClick={() => handleReact(message._id, '👍')}>
              React
            </button>
            <button onClick={() => handleReply(message._id, 'Reply content')}>
              Reply
            </button>
            {message.replies && (
              <ul>
                {message.replies.map((reply) => (
                  <li key={reply._id}>
                    {reply.content}
                    {/* Add more reply interactions here */}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectMessageList;
