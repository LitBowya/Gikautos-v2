import React, { useState } from "react";
import { Comment, Image, Icon, Popup, Label, Button } from "semantic-ui-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import MessageContentCss from "./MessageContent.module.css";

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
          <Label circular className={MessageContentCss.reactionsLabel}>
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
      <Comment key={reply.id} className={MessageContentCss.repliesComment}>
        <Comment.Content className={MessageContentCss.repliesContent}>
          <Comment.Avatar
            src={reply.profilePicture}
            className={MessageContentCss.repliesAvatar}
          />
          <Comment.Author className={MessageContentCss.repliesAuthor}>
            {reply.userName}
          </Comment.Author>
          <Comment.Metadata className={MessageContentCss.repliesMetadata}>
            {reply.createdTime}
          </Comment.Metadata>
          <Comment.Text
            className={MessageContentCss.repliesText}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {reply.content}
          </Comment.Text>
        </Comment.Content>
      </Comment>
    ));
  };

  return (
    <Comment
      className={
        ownMessage ? MessageContentCss.ownMessage : MessageContentCss.comment
      }
    >
      <Comment.Content className={MessageContentCss.content}>
        <div className={MessageContentCss.top}>
          <Comment.Avatar
            src={message.user.profilePicture}
            className={
              ownMessage
                ? MessageContentCss.ownMessageAvatar
                : MessageContentCss.commentAvatar
            }
          />
          <Comment.Author
            className={
              ownMessage
                ? MessageContentCss.ownMessageAuthor
                : MessageContentCss.commentAuthor
            }
          >
            {message.user.name}
          </Comment.Author>
        </div>

        {message.image ? (
          <Image src={message.image} className={MessageContentCss.image} />
        ) : (
          <Comment.Text
            className={
              ownMessage
                ? MessageContentCss.ownMessageText
                : MessageContentCss.commentText
            }
            // style={{ whiteSpace: "pre-wrap" }}
          >
            {message.content}
          </Comment.Text>
        )}
        <div className={MessageContentCss.reactions}>{renderReactions()}</div>
        <div className={MessageContentCss.down}>
          <Comment.Metadata
            className={
              ownMessage
                ? MessageContentCss.ownMessageMetadata
                : MessageContentCss.commentMetadata
            }
          >
            {message.createdTime}
          </Comment.Metadata>
          <Comment.Actions className={MessageContentCss.actions}>
            {ownMessage ? (
              <>
                <Popup
                  trigger={
                    <Icon
                      name="edit"
                      className={MessageContentCss.actionsIcon}
                    />
                  }
                  content={
                    <Button
                      className={MessageContentCss.actionsButton}
                      onClick={() => onEdit(message.id, message.content)}
                    >
                      Edit
                    </Button>
                  }
                  on="click"
                  position="top center"
                />
                <Popup
                  trigger={
                    <Icon
                      name="smile"
                      className={MessageContentCss.actionsIcon}
                      onClick={() => setShowEmojiPicker(true)}
                    />
                  }
                  content={
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  }
                  on="click"
                  open={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                />
                <Icon
                  name="trash"
                  className={MessageContentCss.actionsIcon}
                  onClick={() => onDelete(message.id)}
                />
              </>
            ) : (
              <>
                <Icon
                  name="reply"
                  className={MessageContentCss.actionsIcon}
                  onClick={() => onReply(message)}
                />
                <Popup
                  trigger={
                    <Icon
                      name="smile"
                      className={MessageContentCss.actionsIcon}
                      onClick={() => setShowEmojiPicker(true)}
                    />
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
        </div>
      </Comment.Content>
      {message.replies && Object.keys(message.replies).length > 0 && (
        <Button
          className={MessageContentCss.repliesButton}
          onClick={() => setShowReplies(!showReplies)}
        >
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
