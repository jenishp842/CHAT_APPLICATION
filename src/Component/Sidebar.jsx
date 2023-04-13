import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupModal from "./GroupModal";
import "./button_ui.css";
import { ENDPOINT } from "../Endpoint";

const Sidebar = ({ data, setCurrentChat, currentChat, handleSelectUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeGroups, setActiveGroups] = useState([]);

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
console.log(activeGroups,"💥")
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          <div>
            <h4 className="chat__header">ACTIVE GROUPS</h4>
            <div className="chat__users">
              {activeGroups.map((group) => (
                <div
                  className="user-chat"
                  onClick={() => {
                    setCurrentChat(group);
                  }}
                >
                  <img src={group.image} className="chat-image" />
                  <p className="user_list">{group.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <GroupModal users={data} closeModal={closeModal} />}
    </>
  );
};

export default Sidebar;
