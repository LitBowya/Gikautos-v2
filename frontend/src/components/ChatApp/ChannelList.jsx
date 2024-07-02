import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useFetchChannelsQuery,
  useJoinChannelMutation,
  useLeaveChannelMutation,
  useCreateChannelMutation,
  useDeleteChannelMutation,
  useEditChannelMutation,
} from "../../slices/channelSlice";
import ChannelMembers from "./ChannelMembers";
import MessageList from "./MessageList";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";
import { FaEdit, FaTrash, FaPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const ChannelList = () => {
  const { data: channels, isLoading, isError, refetch } = useFetchChannelsQuery();
  const [joinChannel] = useJoinChannelMutation();
  const [leaveChannel] = useLeaveChannelMutation();
  const [createChannel] = useCreateChannelMutation();
  const [deleteChannel] = useDeleteChannelMutation();
  const [editChannel] = useEditChannelMutation();
  const [selectedChannel, setSelectedChannel] = useState("");
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [newChannelName, setNewChannelName] = useState("");
  const [createChannelName, setCreateChannelName] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo.isAdmin === true;

  const handleJoin = async (channelId) => {
    await joinChannel(channelId);
    window.location.reload();
    refetch();
  };

  const handleLeave = async (channelId) => {
    await leaveChannel(channelId);
    window.location.reload();
    refetch();
  };

  const handleCreate = async () => {
    if (createChannelName.trim() !== "") {
      try {
        await createChannel({ name: createChannelName });
        setCreateChannelName("");
        refetch();
      } catch (error) {
        console.error("Error creating channel:", error);
        alert("Failed to create channel. Please try again.");
      }
    }
  };

  const handleDelete = async (channelId) => {
    if (window.confirm("Delete channel?")) {
      try {
        await deleteChannel(channelId);
        refetch();
      } catch (error) {
        console.error("Error deleting channel:", error);
        alert("Failed to delete channel. Please try again.");
      }
    }
  };

  const handleEdit = async (channelId, channelName) => {
    try {
      await editChannel({ channelId, channel: { name: channelName } });
      setEditingChannelId(null);
      setNewChannelName("");
      refetch();
    } catch (error) {
      console.error("Error editing channel:", error);
      alert("Failed to edit channel. Please try again.");
    }
  };

  const handleSelectChannel = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleCreateKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  const handleEditKeyPress = (e, channelId, channelName) => {
    if (e.key === "Enter") {
      handleEdit(channelId, channelName);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]); // Fetch channels on initial mount

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">Error loading channels</Message>;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ flex: "1", padding: "10px", borderRight: "2px solid #ccc" }}>
        <h2>Channels</h2>
        {isAdmin && (
          <div className="mb-3">
            <input
              type="text"
              value={createChannelName}
              onChange={(e) => setCreateChannelName(e.target.value)}
              onKeyDown={handleCreateKeyPress}
              placeholder="New channel name"
              style={{ width: "80%", marginRight: "10px" }}
            />
            <button onClick={handleCreate}>
              <FaPlus />
            </button>
          </div>
        )}
        <ul>
          {channels &&
            channels.map((channel) => (
              <li
                key={channel._id}
                onClick={() => handleSelectChannel(channel._id)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedChannel === channel._id ? "#f0f0f0" : "transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>{channel.name}</div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {isAdmin && (
                      <>
                        <FaEdit
                          title="Edit"
                          style={{ cursor: "pointer", fontSize: "14px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingChannelId(channel._id);
                            setNewChannelName(channel.name);
                          }}
                        />
                        <FaTrash
                          title="Delete"
                          style={{ cursor: "pointer", fontSize: "14px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(channel._id);
                          }}
                        />
                      </>
                    )}
                    {!channel.members.includes(userInfo._id) ? (
                      <FaSignInAlt
                        title="Join"
                        style={{ cursor: "pointer", fontSize: "14px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoin(channel._id);
                        }}
                      />
                    ) : (
                      <FaSignOutAlt
                        title="Leave"
                        style={{ cursor: "pointer", fontSize: "14px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeave(channel._id);
                        }}
                      />
                    )}
                  </div>
                </div>
                {editingChannelId === channel._id && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      onKeyDown={(e) => handleEditKeyPress(e, channel._id, newChannelName)}
                      style={{ width: "80%", marginRight: "10px" }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(channel._id, newChannelName);
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChannelId(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
        </ul>
        <div className="my-2">{selectedChannel && <ChannelMembers channelId={selectedChannel} />}</div>
      </div>
      <div style={{ flex: "4", padding: "10px" }}>{selectedChannel && <MessageList channelId={selectedChannel} />}</div>
    </div>
  );
};

export default ChannelList;
