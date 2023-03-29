import React, { useState } from "react";
import { ENDPOINT } from "../Endpoint";
import axios from "axios";

const ChatContent = ({
  handleLogout,
  handleSendMessage,
  currentChat,
  chatData,
  setChatData,
}) => {
  const [text, setText] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!text) return
    setChatData({...chatData,messages:[...chatData.messages,{message:text}]});
        setText("")
    axios
      .post(
        `${ENDPOINT}/send`,
        {
          chat: chatData?._id,
          message: text,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="chat__main">
        <header className="chat__mainHeader">
          <p>{currentChat?.name}</p>
          <button className="leaveChat__btn" onClick={handleLogout}>
            LEAVE CHAT
          </button>
        </header>

        <div className="message__container">
          {chatData?.messages?.map((item) => (
            <div className="message__chats">
              <p className={`${currentChat._id === item.sender ? "receiver_name" : "sender__name"} `}>
                {currentChat._id === item.sender ? currentChat.name : "You"}
              </p>
              <div
                className={
                  currentChat._id === item.sender
                    ? "message__recipient"
                    : "message__sender"
                }
              >
                <p>{item.message}</p>
              </div>
            </div>
          ))}
          {/* <div className="message__chats">
            <p className="sender__name">You</p>
            <div className="message__sender">
              <p>Hello there</p>
            </div>
          </div>

          <div className="message__chats">
            <p>Other</p>
            <div className="message__recipient">
              <p>Hey, I'm good, you?</p>
            </div>
          </div> */}
{/* 
          <div className="message__status">
            <p>Someone is typing...</p>
          </div> */}
        </div>
        <div className="chat__footer">
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write message"
              className="message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="sendBtn">SEND</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatContent;
