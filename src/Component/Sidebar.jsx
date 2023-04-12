import React from "react";

const Sidebar = ({ data, setCurrentChat, currentChat, handleSelectUser }) => {
  const onChatHandle = (item) => {
    setCurrentChat(item);
  };
  return (
    <>
      <div className="chat__sidebar">
        <h2>Open Chat</h2>

        <div>
          <h4 className="chat__header">ACTIVE USERS</h4>
          <div className="chat__users">
            {data &&
              data?.map((i) => (
                <div
                  className="user-chat"
                  onClick={() => {
                    onChatHandle(i);
                  }}
                >
                  <img src={i.profilepic} className="chat-image" />
                  <p className="user_list">{i.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
