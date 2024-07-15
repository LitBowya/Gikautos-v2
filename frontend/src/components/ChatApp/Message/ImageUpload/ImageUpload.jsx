import React, { useState } from "react";
import { Input, Modal, Button, Icon } from "semantic-ui-react";
import "./ImageUpload.css";

export const ImageUpload = (props) => {
  const [fileState, setFileState] = useState(null);

  const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];

  const onFileAdded = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileState(file);
    }
  };

  const submit = () => {
    if (fileState && acceptedTypes.includes(fileState.type)) {
      props.uploadImage(fileState, fileState.type);
      props.onClose();
      setFileState(null);
    } else {
      console.log("File type not supported or file not selected.");
    }
  };

  return (
    <Modal
      basic
      open={props.open}
      onClose={props.onClose}
      centered
      size="mini"
      className="image_upload_modal"
    >
      <Modal.Header>Select an image</Modal.Header>
      <Modal.Content>
        <Input
          type="file"
          name="file"
          onChange={onFileAdded}
          fluid
          label="File Type (png, jpeg)"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={submit}>
          <Icon name="checkmark" />
          Add
        </Button>
        <Button color="red" onClick={props.onClose}>
          <Icon name="remove" />
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
