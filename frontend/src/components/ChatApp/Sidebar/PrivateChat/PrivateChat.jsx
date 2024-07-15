import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import { database, ref, onValue, off } from "../../../../config/firebase";
import { setUserInfo } from "../../../../slices/userSlice";
import "./PrivateChat.css";

const PrivateChat = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const channel = useSelector((state) => state.channel);
  const dispatch = useDispatch();

  const [usersState, setUsersState] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    if (!channel) return;

    const messagesRef = ref(database, `messages/${channel.channelId}`);

    const handleMessages = (snapshot) => {
      const users = {};

      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.user && message.user.id && !users[message.user.id]) {
          users[message.user.id] = { ...message.user, isPrivateChat: true };
        }
      });
      setUsersState(Object.values(users));
    };

    onValue(messagesRef, handleMessages, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => {
      off(messagesRef, "value", handleMessages);
    };
  }, [channel]);

  const displayUsers = () => {
    if (usersState.length > 0) {
      return usersState
        .filter((user) => user.id !== userInfo.id)
        .map((user) => (
          <Menu.Item
            key={user.id}
            className={`users_list ${activeUser === user.id ? "active" : ""}`}
            onClick={() => handleUserClick(user.id, user.name)}
          >
            {`@ ${user.name}`}
          </Menu.Item>
        ));
    }
  };

  const handleUserClick = (userId, userName) => {
    setActiveUser(userId);
    dispatch(setUserInfo({ userId, userName }));
  };

  return (
    <Menu.Menu className="users my-3">
      <div className="d-flex justify-content-between">
        <Menu.Item>
          <span className="text-white fw-bold h5">
            <Icon name="mail" />
            Chat
          </span>
          <span className="text-white px-1 fw-bold h5">
            ({usersState.length})
          </span>
        </Menu.Item>
      </div>
      <div className="py-1">{displayUsers()}</div>
    </Menu.Menu>
  );
};

export default PrivateChat;
