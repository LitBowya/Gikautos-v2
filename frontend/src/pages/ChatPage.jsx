import SidebarMenu from "../components/ChatApp/Sidebar/SidebarMenu";
import { Messages } from "../components/ChatApp/Message/Messages";

const ChatPage = () => {
  return (
    <div className="chat-container">
      <SidebarMenu className='sidebarMenu' />
      <Messages className="messageContainer"/>
    </div>
  );
};

export default ChatPage;
