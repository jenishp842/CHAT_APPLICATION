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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [typingData, setTypingData] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [chatData, setChatData] = useState({});
  const loginUser = JSON.parse(localStorage.getItem("token"));
  useEffect(()=>{
      if(!loginUser){
        navigate("/");
      }
  },[])
  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem("token"));
    if (loginUser && currentChat?._id) {
      axios
        .post(
          `${ENDPOINT}/get-chat`,
          {
            chatuser: currentChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${loginUser.token}`,
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
    const loginUser = JSON.parse(localStorage.getItem("token"));
    if (loginUser) {
      axios
        .post(
          `${ENDPOINT}/get-user`,
          {},
          {
            headers: {
              Authorization: `Bearer ${loginUser.token}`,
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
    } else {
      navigate("/");
    }
  }, []);
  
  useEffect(() => {
    if (receivedMessage) {
      if (
        currentChat._id === receivedMessage.sender ||
        currentChat._id === receivedMessage.id
      ) {
        setChatData((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            { message: receivedMessage.msg, sender: receivedMessage.sender },
          ],
        }));
      }
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
      Socket.on("receive-group-chat", (data) => {
        setReceivedMessage(data);
      });
      Socket.on("istyping", (data) => {
        setTypingData(data);
      });
      Socket.on("newuser", (id) => {
        setData((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, online: true } : item
          )
        );
      });
      Socket.on("remove-user", (id) => {
        setData((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, online: false } : item
          )
        );
      });
    }
  }, [Socket.connected]);

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem("token"));
    if (!loginUser) {
      navigate("/");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    Socket.emit("remove", loginUser._id);
    Socket.disconnect();
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
