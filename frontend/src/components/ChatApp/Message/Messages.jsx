import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  database,
  ref,
  onValue,
  off,
  update,
  remove,
  push,
  set,
} from "../../../config/firebase";
import { Segment, Comment } from "semantic-ui-react";
import MessageContent from "./MessageContent/MessageContent";
import MessageHeader from "./MessageHeader/MessageHeader";
import MessageInput from "./MessageInput/MessageInput";
import { generateChannelId } from "../../../utils/generateChannelId";

import "./Messages.css";

export const Messages = () => {
  const channel = useSelector((state) => state.channel);
  const { userInfo } = useSelector((state) => state.auth);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [messagesState, setMessageState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [reactions, setReactions] = useState({});

  const isPrivateChat = selectedUser && selectedUser.isPrivateChat;

  useEffect(() => {
    let messageRef;

    if (selectedUser) {
      messageRef = ref(
        database,
        `privatechat/${generateChannelId(userInfo.username, selectedUser.name)}`
      );
    } else if (channel) {
      messageRef = ref(database, `messages/${channel.channelId}`);
    }

    if (messageRef) {
      const unsubscribe = onValue(messageRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((childSnapshot) => {
          messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setMessageState(messages);
      });

      return () => {
        off(messageRef, "value", unsubscribe);
      };
    }
  }, [channel, selectedUser, isPrivateChat, userInfo]);

  const handleEditMessage = (messageId, newContent) => {
    let messageRef;
    if (selectedUser) {
      messageRef = ref(
        database,
        `privatechat/${generateChannelId(
          userInfo.username,
          selectedUser.name
        )}/${messageId}`
      );
    } else {
      messageRef = ref(database, `messages/${channel.channelId}/${messageId}`);
    }
    update(messageRef, { content: newContent })
      .then(() => {
        setEditingMessage(null); // Clear the editing state after updating
      })
      .catch((error) => {
        console.error("Error updating message:", error);
      });
  };

  const handleDeleteMessage = (messageId) => {
    let messageRef;
    if (selectedUser) {
      messageRef = ref(
        database,
        `privatechat/${generateChannelId(
          userInfo.username,
          selectedUser.name
        )}/${messageId}`
      );
    } else {
      messageRef = ref(database, `messages/${channel.channelId}/${messageId}`);
    }
    remove(messageRef);
  };

  const handleReactToMessage = (messageId, emoji) => {
    let messageRef;
    if (selectedUser) {
      messageRef = ref(
        database,
        `privatechat/${generateChannelId(
          userInfo.username,
          selectedUser.name
        )}/${messageId}/reactions`
      );
    } else {
      messageRef = ref(
        database,
        `messages/${channel.channelId}/${messageId}/reactions`
      );
    }

    const newReactions = { ...reactions };
    if (!newReactions[messageId]) {
      newReactions[messageId] = [];
    }

    const existingReactionIndex = newReactions[messageId].findIndex(
      (r) => r.userId === userInfo._id
    );

    if (existingReactionIndex !== -1) {
      newReactions[messageId][existingReactionIndex].emoji = emoji;
    } else {
      newReactions[messageId].push({
        userId: userInfo._id,
        userName: userInfo.username,
        emoji,
      });
    }

    // Convert array to object for Firebase update
    const reactionsObject = newReactions[messageId].reduce((acc, reaction) => {
      acc[reaction.userId] = reaction;
      return acc;
    }, {});

    update(messageRef, reactionsObject);
    setReactions(newReactions);
  };

  const handleReplyToMessage = (message) => {
    setReplyingToMessage(message);
  };

  const handleAddReply = (replyContent) => {
    if (!replyingToMessage || !replyContent) return;

    const messageId = replyingToMessage.id;
    let replyRef;

    if (selectedUser) {
      replyRef = ref(
        database,
        `privatechat/${generateChannelId(
          userInfo.username,
          selectedUser.name
        )}/${messageId}/replies`
      );
    } else {
      replyRef = ref(
        database,
        `messages/${channel.channelId}/${messageId}/replies`
      );
    }

    const newReplyRef = push(replyRef);
    const reply = {
      id: newReplyRef.key,
      content: replyContent,
      userId: userInfo._id,
      userName: userInfo.username,
      profilePicture: userInfo.profilePicture,
      createdTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    set(newReplyRef, reply)
      .then(() => {
        setReplyingToMessage(null);
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      });
  };

  const displayMessages = () => {
    let messagesToDisplay = searchTermState
      ? filterMessageBySearchTerm()
      : messagesState;

    if (messagesToDisplay.length > 0) {
      return messagesToDisplay.map((message) =>
        message.user && message.user.id ? (
          <MessageContent
            ownMessage={message.user.id === userInfo._id}
            key={message.id}
            message={message}
            onEdit={(id, content) => setEditingMessage({ id, content })}
            onDelete={handleDeleteMessage}
            onReply={handleReplyToMessage}
            onReact={handleReactToMessage}
            reactions={reactions[message.id] || []}
            replyToMessage={replyingToMessage}
          />
        ) : null
      );
    }
  };

  const uniqueUsersCount = () => {
    if (!Array.isArray(messagesState)) {
      return 0;
    }
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
      <MessageInput
        editingMessage={editingMessage}
        onEditMessage={handleEditMessage}
        replyToMessage={replyingToMessage}
        onAddReply={handleAddReply}
      />
    </div>
  );
};
