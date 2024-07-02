// src/components/ReplyList.js

import React from 'react';
import {
  useEditReplyMutation,
  useDeleteReplyMutation,
  useReactToReplyMutation,
} from '../../slices/replySlice';

const ReplyList = ({ replies }) => {
  const [editReply] = useEditReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [reactToReply] = useReactToReplyMutation();

  const handleEdit = (replyId, newContent) => {
    editReply({ replyId, reply: { content: newContent } });
  };

  const handleDelete = (replyId) => {
    deleteReply(replyId);
  };

  const handleReact = (replyId, reaction) => {
    reactToReply({ replyId, reaction });
  };

  return (
    <ul>
      {replies.map((reply) => (
        <li key={reply._id}>
          {reply.content}
          <button onClick={() => handleEdit(reply._id, 'Updated content')}>
            Edit
          </button>
          <button onClick={() => handleDelete(reply._id)}>Delete</button>
          <button onClick={() => handleReact(reply._id, '👍')}>React</button>
          {/* Add nested replies here if needed */}
        </li>
      ))}
    </ul>
  );
};

export default ReplyList;
