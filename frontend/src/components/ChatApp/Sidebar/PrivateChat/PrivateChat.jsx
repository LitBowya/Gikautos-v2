import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import {
  database,
  ref,
  onValue,
  onChildAdded,
  onChildRemoved,
  off,
  onDisconnect,
  set,
} from "../../../../config/firebase";
import { setSelectedUser, setUserInfo } from "../../../../slices/userSlice";
import { generateChannelId } from "../../../../utils/generateChannelId";
import "./PrivateChat.css";

const PrivateChat = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const channel = useSelector((state) => state.channel);
  const dispatch = useDispatch();

  const [usersState, setUsersState] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [connectedUserState, setConnectedUserState] = useState([]);

  const connectedRef = ref(database, ".info/connected");

  const statusRef = ref(database, "status");

  useEffect(() => {
    const messagesRef = ref(database, `messages/${channel.channelId}`);

    const handleMessages = (snapshot) => {
      const users = {};
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (
          message.user &&
          message.user.id &&
          !users[message.user.id] &&
          message.user.id !== userInfo._id
        ) {
          users[message.user.id] = { ...message.user, isPrivateChat: true };
        }
      });
      setUsersState(Object.values(users));
    };

    onValue(messagesRef, handleMessages, (error) => {
      console.error("Error fetching messages:", error);
    });

    onValue(connectedRef, (snapshot) => {
      if (userInfo._id && snapshot.val()) {
        const userStatusRef = ref(database, `status/${userInfo._id}`);
        set(userStatusRef, true);
        onDisconnect(userStatusRef).remove();
      }
    });

    return () => {
      off(messagesRef, "value", handleMessages);
      off(connectedRef, "value");
    };
  }, [channel, userInfo._id, connectedRef, statusRef]);

  useEffect(() => {
    const handleChildAdded = (snap) => {
      setConnectedUserState((currentState) => {
        let updatedState = [...currentState];
        updatedState.push(snap.key);
        return updatedState;
      });
    };

    const handleChildRemoved = (snap) => {
      setConnectedUserState((currentState) => {
        let updatedState = [...currentState];
        let index = updatedState.indexOf(snap.key);
        updatedState.splice(index, 1);
        return updatedState;
      });
    };

    onChildAdded(statusRef, handleChildAdded);
    onChildRemoved(statusRef, handleChildRemoved);

    return () => {
      off(statusRef, "child_added", handleChildAdded);
      off(statusRef, "child_removed", handleChildRemoved);
    };
  }, [statusRef]);

  const displayUsers = () => {
    if (usersState.length > 0) {
      return usersState.map((user) => (
        <>
          <Menu.Item
            key={user.id}
            className={`users_list ${activeUser === user.id ? "active" : ""}`}
            onClick={() => selectUser(user)}
          >
            {`@ ${user.name}`}
            <Icon
              name="circle"
              color={`${
                connectedUserState.indexOf(user.id) !== -1 ? "green" : "red"
              }`}
            />
          </Menu.Item>
        </>
      ));
    }
  };

  const selectUser = (user) => {
    const userTemp = {
      ...user,
      channelId: generateChannelId(userInfo.username, user.name),
    };
    dispatch(setSelectedUser(userTemp));
    dispatch(
      setUserInfo({ userId: userInfo._id, userName: userInfo.username })
    );
    setActiveUser(user.id);
  };

  const setLastVisit = (user, channel) => {
    // const lastVisited = usersRef.child(userInfo._id);
  }

  return (
    <Menu.Menu className="users">
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
