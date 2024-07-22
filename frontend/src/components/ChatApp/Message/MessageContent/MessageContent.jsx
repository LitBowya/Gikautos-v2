import React, { useState } from "react";
import { Comment, Image, Icon, Popup, Label, Button } from "semantic-ui-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./MessageContent.css";

const MessageContent = ({
  message,
  ownMessage,
  onEdit,
  onDelete,
  onReply,
  onReact,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onReact(message.id, emoji.native);
    setShowEmojiPicker(false);
  };

  const renderReactions = () => {
    if (!message.reactions) return null;

    const reactionsArray = Object.values(message.reactions);

    const groupedReactions = reactionsArray.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction.userName);
      return acc;
    }, {});

    return Object.keys(groupedReactions).map((emoji) => (
      <Popup
        key={emoji}
        content={groupedReactions[emoji].join(", ")}
        trigger={
          <Label circular>
            {emoji} {groupedReactions[emoji].length}
          </Label>
        }
      />
    ));
  };

  const renderReplies = () => {
    if (!message.replies || message.replies.length === 0) return null;
    const repliesArray = Object.values(message.replies);

    return repliesArray.map((reply) => (
      <Comment key={reply.id}>
        <Comment.Content>
          <Comment.Avatar src={reply.profilePicture} />
          <Comment.Author>{reply.userName}</Comment.Author>
          <Comment.Metadata>{reply.createdTime}</Comment.Metadata>
          <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
            {reply.content}
          </Comment.Text>
        </Comment.Content>
      </Comment>
    ));
  };

  return (
    <Comment className={ownMessage ? "ownMessage" : null}>
      <Comment.Content>
        <Comment.Avatar src={message.user.profilePicture} />
        <Comment.Author>{message.user.name}</Comment.Author>
        <Comment.Metadata>{message.createdTime}</Comment.Metadata>
        {message.image ? (
          <Image src={message.image} />
        ) : (
          <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
            {message.content}
          </Comment.Text>
        )}
        {renderReactions()}
        <Comment.Actions>
          {ownMessage && (
            <>
              <Popup
                trigger={<Icon name="edit" />}
                content={
                  <Button onClick={() => onEdit(message.id, message.content)}>
                    Edit
                  </Button>
                }
                on="click"
                position="top center"
              />
              <Popup
                trigger={
                  <Icon name="smile" onClick={() => setShowEmojiPicker(true)} />
                }
                content={
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                }
                on="click"
                open={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
              />
              <Icon name="trash" onClick={() => onDelete(message.id)} />
            </>
          )}
          {!ownMessage && (
            <>
              <Icon name="reply" onClick={() => onReply(message)} />
              <Popup
                trigger={
                  <Icon name="smile" onClick={() => setShowEmojiPicker(true)} />
                }
                content={
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                }
                on="click"
                open={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
              />
            </>
          )}
        </Comment.Actions>
      </Comment.Content>
      {message.replies && Object.keys(message.replies).length > 0 && (
        <Button onClick={() => setShowReplies(!showReplies)}>
          {showReplies
            ? "Hide replies"
            : `Show replies (${Object.keys(message.replies).length})`}
        </Button>
      )}
      {showReplies && renderReplies()}
    </Comment>
  );
};

export default MessageContent;
