import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useFetchMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useReplyToMessageMutation,
} from "../../slices/messageSlice";
import {
  useFetchRepliesQuery,
  useDeleteReplyMutation,
  useReplyToReplyMutation,
} from "../../slices/replySlice";
import {
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaSmile,
  FaReply,
} from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Loader from "../Loader/Loader";
import socket from "../../socket";
import moment from "moment";
import { Collapse, Button } from "react-bootstrap";

const MessageList = ({ channelId }) => {
  const {
    data: messages = [],
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    refetch: refetchMessages,
  } = useFetchMessagesQuery(channelId);

  const {
    data: replies = [],
    isLoading: isRepliesLoading,
    isError: isRepliesError,
    refetch: refetchReplies,
  } = useFetchRepliesQuery();

  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [replyToMessage] = useReplyToMessageMutation();

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [replyMode, setReplyMode] = useState(null);
  const [replyToReplyMode, setReplyToReplyMode] = useState(null);

  const [deleteReply] = useDeleteReplyMutation();
  const [replyToReply] = useReplyToReplyMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinChannel", channelId);
  
    socket.on("connect", () => {
      console.log("Connected to the server");
    });
  
    socket.on("message", (message) => {
      console.log("New message received", message);
      refetchMessages();
    });
  
    socket.on("messageDeleted", (messageId, channelId) => {
      console.log(`Message deleted ${messageId} for channel ${channelId}`);
      refetchMessages();
    });
  
    socket.on("messageEdited", (message) => {
      console.log("Message edited", message);
      refetchMessages();
    });
  
    socket.on("replyAdded", (reply) => {
      console.log("Reply added", reply);
      refetchReplies();
    });
  
    socket.on("replyDeleted", (replyId) => {
      console.log("Reply deleted", replyId);
      refetchReplies();
    });
  
    socket.on("replyEdited", (reply) => {
      console.log("Reply edited", reply);
      refetchReplies();
    });
  
    socket.on("replyToReplyAdded", (reply) => {
      console.log("Reply to reply added", reply);
      refetchReplies();
    });
  
    return () => {
      socket.emit("leaveChannel", channelId);
      socket.off("connect");
      socket.off("message");
      socket.off("messageDeleted");
      socket.off("messageEdited");
      socket.off("replyAdded");
      socket.off("replyDeleted");
      socket.off("replyEdited");
      socket.off("replyToReplyAdded");
    };
  }, [channelId, refetchMessages, refetchReplies]);  

  useEffect(() => {
    if (chatEndRef.current) {
      const scrollOffset = chatEndRef.current.scrollHeight - chatEndRef.current.clientHeight;
      if (scrollOffset <= chatEndRef.current.scrollTop) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages.length]);
  

  const handleSend = async () => {
    if (newMessage.trim() !== "") {
      try {
        if (editMode) {
          await editMessage({
            messageId: editMode,
            message: { content: newMessage },
          });
          socket.emit("editMessage", {
            messageId: editMode,
            content: newMessage,
          });
          setEditMode(null);
        } else if (replyMode) {
          await replyToMessage({
            messageId: replyMode,
            reply: { content: newMessage },
          });
          socket.emit("replyMessage", {
            messageId: replyMode,
            content: newMessage,
          });
          setReplyMode(null);
        } else if (replyToReplyMode) {
          const parentReply = replies.find((r) => r._id === replyToReplyMode);
          if (!parentReply) {
            console.error("Parent reply not found");
            return;
          }
          const reply = await replyToReply({
            replyId: replyToReplyMode,
            reply: { content: newMessage, sentBy: userInfo._id, message: parentReply.message },
          });
          refetchReplies()
          socket.emit("replyToReplyAdded", reply);
          setReplyToReplyMode(null);
        } else {
          const { data } = await sendMessage({
            channelId,
            message: { content: newMessage, channelId },
          });
          socket.emit("sendMessage", data);
        }
        setNewMessage("");
      } catch (error) {
        console.error("Could not send message", error);
      }
    }
  };  

  const handleEdit = (messageId, content) => {
    setNewMessage(content);
    setEditMode(messageId);
    setReplyMode(null);
    setReplyToReplyMode(null);
  };

  const handleDelete = async (messageId) => {
    if (window.confirm("Delete message?")) {
      try {
        await deleteMessage(messageId);
        socket.emit("deleteMessage", messageId);
        refetchMessages();
      } catch (error) {
        console.error("Failed to delete message", error);
      }
    }
  };

  const handleReply = (messageId, content) => {
    setNewMessage(`Replying to: "${content}"\n`);
    setReplyMode(messageId);
    setEditMode(null);
    setReplyToReplyMode(null);
  };

  const handleReplyToReply = (replyId, content) => {
    setNewMessage(`Replying to: "${content}"\n`);
    setReplyToReplyMode(replyId);
    setEditMode(null);
    setReplyMode(null);
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Delete reply?")) {
      try {
        await deleteReply(replyId);
        socket.emit("deleteReply", replyId);
        refetchMessages();
      } catch (error) {
        console.error("Failed to delete reply", error);
      }
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = moment(message.createdAt)
        .startOf("day")
        .format("YYYY-MM-DD");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  const renderDateLabel = (date) => {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");
    if (date.isSame(today, "d")) {
      return "Today";
    } else if (date.isSame(yesterday, "d")) {
      return "Yesterday";
    } else {
      return date.format("MMMM Do, YYYY");
    }
  };

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0) return null;
  
    return replies.map((reply) => {
      if (!reply) {
        console.error("Reply is undefined");
        return null;
      }
  
      if (!reply.sentBy) {
        console.error("reply.sentBy is undefined for reply:", reply);
        return null;
      }
  
      return (
        <li
          key={reply._id}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor:
              reply.sentBy._id === userInfo._id ? "#e0ffe0" : "#f9f9f9",
            borderRadius: "5px",
            marginLeft: "20px", // Indent nested replies
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={reply.sentBy.profilePicture || ""}
                alt="Profile"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span>{reply.sentBy.username || "Unknown"}</span>
            </div>
            <span>{moment(reply.createdAt).format("hh:mm A")}</span>
            <div>
              {reply.sentBy._id === userInfo._id ? (
                <>
                  <FaTrash
                    data-tip="Delete"
                    style={{ cursor: "pointer", marginRight: "5px" }}
                    onClick={() => handleDeleteReply(reply._id)}
                  />
                </>
              ) : (
                <FaReply
                  data-tip="Reply"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleReplyToReply(reply._id, reply.content)}
                />
              )}
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>{reply.content}</div>
          {renderReplies(reply.replies)}
        </li>
      );
    });
  };  
  

  if (isMessagesLoading || isRepliesLoading) return <Loader />;
  if (isMessagesError || isRepliesError) return <div>You are not part of this channel</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          flex: "1 1 auto",
          overflowY: "auto",
          padding: "10px",
          overflowX: "hidden",
        }}
      >
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <h4 style={{ textAlign: "center" }}>
              {renderDateLabel(moment(date))}
            </h4>
            <ul>
              {groupedMessages[date].map((message) => (
                <li
                  key={message._id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor:
                      message.sentBy._id === userInfo._id
                        ? "#e0ffe0"
                        : "#f0f0f0",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={userInfo.profilePicture}
                        alt="Profile"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      <span>{message.sentBy.username}</span>
                    </div>
                    <span>{moment(message.createdAt).format("hh:mm A")}</span>
                    <div>
                      {message.sentBy._id === userInfo._id ? (
                        <>
                          <FaEdit
                            data-tip="Edit"
                            style={{ cursor: "pointer", marginRight: "5px" }}
                            onClick={() =>
                              handleEdit(message._id, message.content)
                            }
                          />
                          <FaTrash
                            data-tip="Delete"
                            style={{ cursor: "pointer", marginRight: "5px" }}
                            onClick={() => handleDelete(message._id)}
                          />
                        </>
                      ) : (
                        <FaReply
                          data-tip="Reply"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleReply(message._id, message.content)
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: "10px" }}>{message.content}</div>
                  {message.replies && message.replies.length > 0 && (
                    <ul>{renderReplies(message.replies)}</ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <textarea
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: "1",
            borderRadius: "5px",
            padding: "10px",
            marginRight: "10px",
          }}
        />
        <Button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{ marginRight: "10px" }}
        >
          <FaSmile />
        </Button>
        {showEmojiPicker && (
          <div style={{ position: "absolute", bottom: "60px", right: "20px" }}>
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
        <Button onClick={handleSend}>
          <FaPaperPlane />
        </Button>
      </div>
    </div>
  );
};

export default MessageList;
