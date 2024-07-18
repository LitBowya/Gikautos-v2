import React, { useState } from "react";
import { Comment, Image, Button, Icon, Popup, Input } from "semantic-ui-react";
import "./MessageContent.css";

const MessageContent = ({
  message,
  ownMessage,
  onEdit,
  onDelete,
  onReply,
  onReact,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  return (
    <Comment className={ownMessage ? "ownMessage" : null}>
      <Comment.Content>
        <Comment.Avatar src={message.user.profilePicture} />
        <Comment.Author>{message.user.name}</Comment.Author>
        <Comment.Metadata>{message.createdTime}</Comment.Metadata>
        {isEditing ? (
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            action={{
              icon: "save",
              onClick: handleEdit,
            }}
          />
        ) : message.image ? (
          <Image src={message.image} />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
        <Comment.Actions>
          {ownMessage && (
            <>
              <Popup
                trigger={<Icon name="edit" />}
                content={
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                }
                on="click"
                position="top center"
              />
              <Icon name="trash" onClick={() => onDelete(message.id)} />
            </>
          )}
          {!ownMessage && (
            <>
              <Icon name="reply" onClick={() => onReply(message)} />
              <Icon name="smile" onClick={() => onReact(message)} />
            </>
          )}
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );
};

export default MessageContent;
