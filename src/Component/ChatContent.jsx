import React, { useEffect, useRef, useState } from "react";
import { ENDPOINT } from "../Endpoint";
import axios from "axios";
import { Socket } from "../Socket";
import GroupModal from "./GroupModal";

const ChatContent = ({
  handleLogout,
  handleSendMessage,
  currentChat,
  chatData,
  setChatData,
}) => {
  const loginUser = JSON.parse(localStorage.getItem("token"));
  const chatContainerRef = useRef(null);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  const [typing, setisTyping] = useState(false);
  const [timeout, setTiemout] = useState("");
  const [text, setText] = useState("");
  const showUsers = () => {
    setIsGroupDetailsOpen(currentChat.users);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text) return;
    if (currentChat?.isGroup) {
      Socket.emit("group-chat", {
        users: currentChat?.users?.filter((item) => item._id !== loginUser._id),
        sender: loginUser._id,
        id: currentChat._id,
        msg: text,
      });
    } else {
      Socket.emit("chat", {
        receiver: currentChat._id,
        msg: text,
        sender: {
          _id: loginUser._id,
          name: loginUser.name,
        },
      });
    }
    setText("");
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
        setChatData({
          ...chatData,
          messages: [
            ...chatData.messages,
            {
              message: text,
              sender: {
                _id: loginUser._id,
                name: loginUser.name,
              },
            },
          ],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);
  const handleInput = (e) => {
    clearTimeout(timeout);
    if (!typing) {
      console.log("typing fe");
      setisTyping(true);
      Socket.emit("typing", {
        receiver: currentChat._id,
        sender: loginUser._id,
      });
    }
    setTiemout(
      setTimeout(() => {
        setisTyping(false);
        Socket.emit("typing", {
          stoptyping: true,
          receiver: currentChat._id,
          sender: loginUser._id,
        });
      }, 2000)
    );
    setText(e.target.value);
  };
  // const handleInputChange = (event) => {
  //   setMessage(event.target.value);

  //   if (!isTyping) {
  //     setIsTyping(true);
  //     socket.emit("typing", { username, room });
  //   } else {
  //     clearTimeout(typingTimer);
  //   }

  //   const typingTimer = setTimeout(() => {
  //     setIsTyping(false);
  //     socket.emit("stop typing", { username, room });
  //   }, 2000);
  // };
  return (
    <>
      <div className="chat__main">
        <header className="chat__mainHeader">
          <p style={{ cursor: "pointer" }} onClick={() => showUsers()}>
            {currentChat?.name}
          </p>

          <button className="leaveChat__btn" onClick={handleLogout}>
            LEAVE CHAT
          </button>
        </header>

        <div className="message__container">
          {chatData?.messages?.map((item) => (
            <div className="message__chats">
              <p
                className={`${
                  loginUser._id !== item.sender?._id
                    ? "receiver_name"
                    : "sender__name"
                } `}
              >
                {loginUser._id !== item.sender?._id ? item.sender?.name : "You"}
              </p>
              <div
                className={
                  loginUser._id !== item.sender?._id
                    ? "message__recipient"
                    : "message__sender"
                }
              >
                <p>{item.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatContainerRef} />
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
        {currentChat.typing && <p>typing</p>}
        <div className="chat__footer">
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Write message"
              className="message"
              value={text}
              onChange={handleInput}
            />
            <button className="sendBtn">SEND</button>
          </form>
        </div>
      </div>
      {isGroupDetailsOpen && (
        <GroupModal
          isGroupDetailsOpen={isGroupDetailsOpen}
          users={isGroupDetailsOpen}
          closeModal={() => setIsGroupDetailsOpen(false)}
          group={currentChat}
        />
      )}
    </>
  );
};

export default ChatContent;
