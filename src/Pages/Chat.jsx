import React, { useEffect, useState } from "react";
import "./chat.css";
import axios from "axios";
import { ENDPOINT } from "../Endpoint";
import Sidebar from "../Component/Sidebar";
import ChatContent from "../Component/ChatContent";
import { useNavigate } from "react-router-dom";
import { Socket } from "../Socket";

function Chat() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [typingData, setTypingData] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [chatData, setChatData] = useState({});
  const loginUser = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (currentChat?._id) {
      axios
        .post(
          `${ENDPOINT}/get-chat`,
          {
            chatuser: currentChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("token"))?.token
              }`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setChatData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentChat]);
  useEffect(() => {
    axios
      .post(
        `${ENDPOINT}/get-user`,
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
        console.log(response);
        setData(response.data.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (receivedMessage) {
      if (currentChat._id !== receivedMessage.sender) return;
      setChatData((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { message: receivedMessage.msg, sender: receivedMessage.sender },
        ],
      }));
    }
  }, [receivedMessage]);
  useEffect(() => {
    if (typingData) {
      if (currentChat._id === typingData.sender) {
        setCurrentChat((prev) => ({ ...prev, typing: !typingData.stoptyping }));
      }
      setData(
        data.map((item) =>
          item._id === typingData.sender
            ? { ...item, typing: !typingData.stoptyping }
            : item
        )
      );
    }
  }, [typingData]);
  useEffect(() => {
    if (Socket.connected) {
      console.log("inside socket conncted", Socket);
      Socket.emit("admit-user", loginUser._id);
      Socket.on("receivedMessage", (data) => {
        console.log(data, currentChat);
        if (loginUser._id === data.receiver) {
          setReceivedMessage(data);
        }
      });
      Socket.on("istyping", (data) => {
        setTypingData(data);
      });
    }
  }, [Socket.connected]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    // handle send message logic
  };

  return (
    <div className="chat">
      <Sidebar
        data={data}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <ChatContent
        handleLogout={handleLogout}
        handleSendMessage={handleSendMessage}
        currentChat={currentChat}
        chatData={chatData}
        setChatData={setChatData}
      />
    </div>
  );
}

export default Chat;
