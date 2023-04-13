import React from "react";
import { useState } from "react";
import axios from "axios";
import "./group_modal.css";
import { ENDPOINT } from "../Endpoint";

const GroupModal = ({ users, closeModal }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleUserSelection = (event) => {
    const userId = event.target.id;
    if (event.target.checked) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
    } else {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((id) => id !== userId)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${ENDPOINT}/create-group`, {
        name: groupName,
        users: selectedUsers,
      },
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token"))?.token
          }`,
        },
      }
      );
      console.log(res.data);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <div className="group-name-input">
            <label htmlFor="group-name">Group Name:</label>
            <input
              type="text"
              id="group-name"
              value={groupName}
              onChange={handleGroupNameChange}
            />
          </div>
          <div className="search-input">
            <label htmlFor="search">Search:</label>
            <input type="text" id="search" />
          </div>
          <h4>Selected Users:</h4>
          <div className="user-list">
            {users.map((user) => (
              <div key={user._id}>
                <label htmlFor={user._id}>{user.name}</label>
                <input
                  type="checkbox"
                  id={user._id}
                  name={user.name}
                  onChange={handleUserSelection}
                />
              </div>
            ))}
          </div>
          <div className="button-group">
            <div className="hover">
              <button className="hover">Create Group</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
