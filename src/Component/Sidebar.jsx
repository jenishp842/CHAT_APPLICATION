import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupModal from "./GroupModal";
import "./button_ui.css";
import { ENDPOINT } from "../Endpoint";

const Sidebar = ({ data, setCurrentChat, currentChat, handleSelectUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeGroups, setActiveGroups] = useState([]);
  const [showActiveUsers, setShowActiveUsers] = useState(true);

  const onChatHandle = (item) => {
    setCurrentChat(item);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axios
      .post(
        `${ENDPOINT}/get-group`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token"))?.token
            }`,
          },
        }
      )
      .then((response) => {
        setActiveGroups(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleActiveGroupsClick = () => {
    setShowActiveUsers(false);
  };
  const handleActiveusersClick = () => {
    setShowActiveUsers(true);
  };
  // const handleActiveUsersClick = () => {
  //   vwt(true);
  // };

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
            <h2 />
          </div>
          <div class="button-group">
            <div class="hover" onClick={openModal}>
              <button class="hover">Create Group</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div
              className="d-flex"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {" "}
              <h4 className="chat__header" onClick={handleActiveusersClick}>
                USER CHATS
              </h4>
              <h4 className="chat__header" onClick={handleActiveGroupsClick}>
                GROUP CHATS
              </h4>
            </div>
            <div
              className="chat__users"
              // style={{ display: showActiveUsers ? "flex" : "none" }}
            >
              {data &&
                (showActiveUsers ? data : activeGroups)?.map((i) => (
                  <div
                    className="user-chat"
                    onClick={() => {
                      onChatHandle(i);
                    }}
                  >
                    {showActiveUsers && (
                      <img src={i.profilepic} className="chat-image" />
                    )}
                    {i.typing ? `${i.name} is typing` : ""}
                    <p
                      className="user_list"
                      style={
                        i.online ? { color: "green", fontWeight: "600" } : {}
                      }
                    >
                      {i.name}
                    </p>
                    {/* {i.online ? <div className="online"/> : null} */}
                  </div>
                ))}
            </div>
          </div>
          {/* <div>
            <h4 className="chat__header" onClick={handleActiveGroupsClick}>ACTIVE GROUPS</h4>
            <div className="chat__users" style={{ display: showActiveUsers ? 'none' : 'flex' }}>
              {activeGroups.map((group) => (
                <div
                  className="user-chat"
                  onClick={() => {
                    setCurrentChat(group);
                  }}
                >
                  <p className="user_list">{group.name}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
      {isModalOpen && <GroupModal users={data} closeModal={closeModal} />}
    </>
  );
};

export default Sidebar;
