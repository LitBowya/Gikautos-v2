import React from 'react';
import { useFetchChannelMembersQuery } from '../../slices/channelSlice';

const ChannelMembers = ({ channelId, onDirectMessageClick }) => {
  const { data: members, isLoading, isError } = useFetchChannelMembersQuery(channelId);

  if (isLoading) return <div>Loading members...</div>;
  if (isError) return <div>Error loading members</div>;

  return (
    <div>
      <h3>Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member._id} onClick={() => onDirectMessageClick(member._id)}>
            {member.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelMembers;
