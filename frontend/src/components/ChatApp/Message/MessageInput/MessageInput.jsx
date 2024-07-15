import React, { useState } from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import { useSelector } from "react-redux";
import {
  database,
  ref,
  push,
  set,
  child,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
} from "../../../../config/firebase";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import { v4 as uuidv4 } from "uuid";

const MessageInput = () => {
  const channelId = useSelector((state) => state.channel.channelId);
  const { userInfo } = useSelector((state) => state.auth);

  const [messageState, setMessageState] = useState("");
  const [fileDialogState, setFileDialog] = useState(false);

  const messageRef = ref(database, "messages");

  const createMessageInfo = (downloadUrl) => {
    const currentTime = new Date();
    return {
      user: {
        profilePicture: userInfo.profilePicture,
        name: userInfo.username,
        id: userInfo._id,
      },
      content: messageState,
      image: downloadUrl || "",
      createdAt: currentTime.toISOString(),
      createdTime: currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  const sendMessage = (downloadUrl) => {
    if ((channelId && messageState) || downloadUrl) {
      const channelMessageRef = child(messageRef, channelId);
      const messageInfo = createMessageInfo(downloadUrl);
      const newMessageRef = push(channelMessageRef);

      set(newMessageRef, messageInfo)
        .then(() => {
          setMessageState("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    } else {
      console.warn("ChannelId or messageState is undefined or empty.");
    }
  };

  const onMessageChange = (e) => {
    const { value } = e.target;
    setMessageState(value);
  };

  const createActionButtons = () => {
    return (
      <>
        <Button
          icon="send"
          onClick={() => {
            sendMessage();
          }}
        />
        <Button icon="upload" onClick={() => setFileDialog(true)} />
      </>
    );
  };

  const uploadImage = (file, contentType) => {
    const filePath = `chat/images/${uuidv4()}.jpg`;
    const storageReference = storageRef(storage, filePath); // Create a non-root reference

    uploadBytes(storageReference, file, { contentType })
      .then((data) => {
        getDownloadURL(data.ref)
          .then((url) => {
            sendMessage(url);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });
  };

  return (
    <Segment>
      <Input
        fluid={true}
        name="message"
        value={messageState}
        label={createActionButtons()}
        labelPosition="right"
        onChange={onMessageChange}
      />
      <ImageUpload
        uploadImage={uploadImage}
        open={fileDialogState}
        onClose={() => setFileDialog(false)}
      />
    </Segment>
  );
};

export default MessageInput;
