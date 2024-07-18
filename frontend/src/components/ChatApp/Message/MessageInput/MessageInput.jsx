import React, { useState, useEffect } from "react";
import { Segment, Input, Button, Popup } from "semantic-ui-react";
import { useSelector } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
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
import { generateChannelId } from "../../../../utils/generateChannelId";

const MessageInput = ({ replyToMessage }) => {
  const channelId = useSelector((state) => state.channel.channelId);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const { userInfo } = useSelector((state) => state.auth);

  const [messageState, setMessageState] = useState("");
  const [fileDialogState, setFileDialog] = useState(false);
  const [emojiPickerState, setEmojiPickerState] = useState(false);

  useEffect(() => {
    if (replyToMessage) {
      setMessageState(`@${replyToMessage.user.name} `);
    }
  }, [replyToMessage]);

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
      replyTo: replyToMessage || null,
    };
  };

  const sendMessage = (downloadUrl) => {
    if ((channelId && messageState) || downloadUrl || selectedUser) {
      let messageRef;

      if (selectedUser) {
        // Sending message to selected user privately using usernames
        messageRef = ref(
          database,
          `privatechat/${generateChannelId(
            userInfo.username,
            selectedUser.name
          )}`
        );
      } else {
        // Sending message to channel
        messageRef = child(ref(database, "messages"), channelId);
      }

      const messageInfo = createMessageInfo(downloadUrl);
      const newMessageRef = push(messageRef);

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
        <Popup
          on="click"
          open={emojiPickerState}
          onClose={() => setEmojiPickerState(false)}
          onOpen={() => setEmojiPickerState(true)}
          trigger={<Button icon="smile" />}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji) =>
              setMessageState((prevState) => prevState + emoji.native)
            }
          />
        </Popup>
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
