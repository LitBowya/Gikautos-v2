import React, { useState } from "react";
import { Comment, Image, Icon, Popup, Label, Button } from "semantic-ui-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { ref, update } from "../../../../config/firebase";
import "./MessageContent.css";

const MessageContent = ({
  message,
  ownMessage,
  onEdit,
  onDelete,
  onReply,
  onReact,
  reactions,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onReact(message.id, emoji.native);
    setShowEmojiPicker(false);
  };

const renderReactions = () => {
  if (!message.reactions) return null;

  // Convert the reactions object to an array
  const reactionsArray = Object.values(message.reactions);

  // Group reactions by emoji
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
    </Comment>
  );
};

export default MessageContent;
