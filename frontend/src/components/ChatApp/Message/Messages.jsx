import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database, ref, onValue, off } from "../../../config/firebase";
import { Segment, Comment } from "semantic-ui-react";
import MessageContent from "./MessageContent/MessageContent";
import MessageHeader from "./MessageHeader/MessageHeader";
import MessageInput from "./MessageInput/MessageInput";

import "./Messages.css";

export const Messages = () => {
  const channel = useSelector((state) => state.channel);
  const { userInfo } = useSelector((state) => state.auth);

  const [messagesState, setMessageState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");

  useEffect(() => {
    if (channel) {
      const messageRef = ref(database, `messages/${channel.channelId}`);
      const unsubscribe = onValue(messageRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((childSnapshot) => {
          messages.push(childSnapshot.val());
        });
        setMessageState(messages);
      });

      return () => {
        off(messageRef, "value", unsubscribe);
      };
    }
  }, [channel]);

  const displayMessages = () => {
    let messagesToDisplay = searchTermState
      ? filterMessageBySearchTerm()
      : messagesState;
    if (messagesToDisplay.length > 0) {
      return messagesToDisplay.map((message) =>
        message.user && message.user.id ? (
          <MessageContent
            ownMessage={message.user.id === userInfo._id}
            key={message.createdAt}
            message={message}
          />
        ) : null // Return null if message.user or message.user.id is undefined
      );
    }
  };

  const uniqueUsersCount = () => {
    const uniqueUsers = messagesState.reduce((acc, message) => {
      if (message.user && !acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    return uniqueUsers.length;
  };

  const searchTermChange = (e) => {
    const target = e.target;
    setSearchTermState(target.value);
  };

  const filterMessageBySearchTerm = () => {
    const regex = new RegExp(searchTermState, "gi");
    const messages = messagesState.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        (message.user && message.user.name.match(regex))
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    return messages;
  };

  const isPrivateChat = channel && channel.isPrivate;
  console.log(isPrivateChat);

  return (
    <div>
      <MessageHeader
        searchTermChange={searchTermChange}
        uniqueUsers={uniqueUsersCount()}
        isPrivateChat={isPrivateChat}
      />
      <Segment className="message_content">
        <Comment.Group>{displayMessages()}</Comment.Group>
      </Segment>
      <MessageInput />
    </div>
  );
};
