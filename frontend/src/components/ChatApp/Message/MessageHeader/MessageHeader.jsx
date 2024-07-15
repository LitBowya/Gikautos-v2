import { Segment, Header, Input, Icon } from "semantic-ui-react";
import { useSelector } from "react-redux";

const MessageHeader = ({ uniqueUsers, searchTermChange, isPrivateChat }) => {
  const channelName = useSelector((state) => state.channel.channelName);
  return (
    <Segment clearing>
      <Header floated="left" fluid="true" as="h2">
        <span>
          {/* {channelName} */}
          {(isPrivateChat ? "@ ": "# ") +channelName}
          {!isPrivateChat && <Icon name="star outline" />}
        </span>
        <Header.Subheader>{uniqueUsers} Users</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          name="search"
          icon="search"
          placeholder="Search Messages"
          size="mini"
          onChange={searchTermChange}
        />
      </Header>
    </Segment>
  );
};

export default MessageHeader;
