import React from "react";
import { useState } from "react";
import GroupModal from "./GroupModal";
import "./button_ui.css"

const Sidebar = ({ data, setCurrentChat, currentChat, handleSelectUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChatHandle = (item) => {
    setCurrentChat(item);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="chat__sidebar">
        <div
          className="d-flex"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2>Open Chat</h2>
          </div>
          <div class="button-group">
          <div class="hover" onClick={openModal}>
            <button class="hover">Create Group</button>
          </div>
          </div>
        </div>
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
                  <div>
                    <p className="user_list">{i.name}</p>
                    {i.typing ? `${i.name} is typing` : ""}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h4 className="chat__header">ACTIVE GROUPS</h4>
          <div className="chat__users">
          
          </div>
        </div>
      </div>
      {isModalOpen && <GroupModal users={data} closeModal={closeModal} />}
    </>
  );
};

export default Sidebar;
