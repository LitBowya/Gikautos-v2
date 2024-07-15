import { Comment, Image } from "semantic-ui-react"
import './MessageContent.css'

const MessageContent = ({ message, ownMessage }) => {
  return (
    <Comment className={ownMessage ? "ownMessage" : null}>
      <Comment.Content>
        <Comment.Avatar src={message.user.profilePicture} />
        <Comment.Author>{message.user.name}</Comment.Author>
        <Comment.Metadata>{message.createdTime}</Comment.Metadata>
        {message.image ? (
          <Image src={message.image} />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default MessageContent