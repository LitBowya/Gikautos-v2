import React, { useState, useEffect } from "react";
import { Menu, Icon, Modal, Button, Form } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import {
  database,
  ref,
  push,
  update,
  onChildAdded,
  off,
} from "../../../../config/firebase";
import { setChannelInfo } from "../../../../slices/channelSlice";
import { clearSelectedUser } from "../../../../slices/userSlice";
// import MessageInput from "../../Message/MessageInput/MessageInput";
import "./Channels.css";

const Channels = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [addChannel, setAddChannel] = useState({
    name: "",
    description: "",
  });
  const [isLoadingState, setLoadingState] = useState(false);
  const [channelsState, setChannelsState] = useState([]);
  const [activeChannel, setActiveChannel] = useState(
    channelsState.length > 0 ? channelsState[0].id : null
  );
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const checkIfFormValid = () => {
    return addChannel && addChannel.name && addChannel.description;
  };

  const channelsRef = ref(database, "channels");

  const onSubmit = () => {
    if (!checkIfFormValid()) {
      return;
    }

    setLoadingState(true);

    const newChannelRef = push(channelsRef);
    const key = newChannelRef.key;

    const channel = {
      id: key,
      name: addChannel.name,
      description: addChannel.description,
      createdBy: userInfo.name,
      createdAt: new Date().toISOString(),
    };

    update(newChannelRef, channel)
      .then(() => {
        setAddChannel({ name: "", description: "" });
        setLoadingState(false);
        closeModal();
      })
      .catch((err) => {
        console.error("Error adding channel:", err);
        setLoadingState(false);
      });
  };

  const handleInput = (e) => {
    let target = e.target;
    setAddChannel((currentState) => {
      let updatedState = { ...currentState };
      updatedState[target.name] = target.value;
      return updatedState;
    });
  };

  useEffect(() => {
    const handleChildAdded = (snapshot) => {
      const newChannel = snapshot.val();
      setChannelsState((currentState) => {
        // Check for existing channel before adding
        if (currentState.some((channel) => channel.id === newChannel.id)) {
          return currentState;
        }
        return [...currentState, newChannel];
      });
    };

    onChildAdded(channelsRef, handleChildAdded);

    return () => {
      off(channelsRef, "child_added", handleChildAdded);
    };
  }, [channelsRef]);

  const displayChannels = () => {
    if (channelsState.length > 0) {
      return channelsState.map((channel) => {
        return (
          <Menu.Item
            key={channel.id}
            className={`channels_list ${
              activeChannel === channel.id ? "active" : ""
            }`} // Add 'active' class if the channel is active
            onClick={() => handleChannelClick(channel.id, channel.name)}
          >
            {`# ${channel.name}`}
          </Menu.Item>
        );
      });
    }
  };

  const handleChannelClick = (channelId, channelName) => {
    setActiveChannel(channelId);
    setSelectedChannelId(channelId);
    dispatch(setChannelInfo({ channelId, channelName }));
    dispatch(clearSelectedUser());
  };

  return (
    <>
      <Menu.Menu className="channels">
        <div className="d-flex justify-content-between">
          <Menu.Item>
            <span className="text-white fw-bold h5">
              <Icon name="exchange" />
              Channels
            </span>
            <span className="text-white px-1 fw-bold h5">
              ({channelsState.length})
            </span>
          </Menu.Item>
          {userInfo.isAdmin && (
            <Menu.Item>
              <span className="text-white" onClick={openModal}>
                <Icon name="add" className="addChannel" />
              </span>
            </Menu.Item>
          )}
        </div>
        <div className="py-1">{displayChannels()}</div>
      </Menu.Menu>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        centered
        size="mini"
        className="channels_modal"
      >
        <Modal.Header>Create Channel</Modal.Header>
        <Modal.Content>
          <Form onClick={onSubmit}>
            <Form.Input
              name="name"
              value={addChannel.name}
              onChange={handleInput}
              type="text"
              placeholder="Enter Channel Name"
            />
            <Form.Input
              name="description"
              value={addChannel.description}
              onChange={handleInput}
              type="text"
              placeholder="Enter Channel Description"
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button loading={isLoadingState} color="green" onClick={onSubmit}>
            <Icon name="checkmark" />
            Save
          </Button>
          <Button color="red" onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Channels;
