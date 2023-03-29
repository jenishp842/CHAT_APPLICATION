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
  const [currentChat, setCurrentChat] = useState(null);
  const [chatData,setChatData] = useState(null)
  useEffect(()=>{
    if(currentChat?._id){
    axios
      .post(
        `${ENDPOINT}/get-chat`,
        {
            chatuser:currentChat._id
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
  },[currentChat])
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
  useEffect(()=>{
    Socket.on("connect", (socket) => {
        console.log("connected socket connection status::", socket);
      });
  },[Socket])

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
