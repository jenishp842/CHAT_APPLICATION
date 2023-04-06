import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chat.css";
import { ENDPOINT } from "../Endpoint";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SelectLogo = () => {
  const [avatars, setAvatars] = useState([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarsResponse = await Promise.all([
        fetch(
          "https://robohash.org/random/" + Math.round(Math.random() * 1000)
        ),
        fetch(
          "https://robohash.org/random/" + Math.round(Math.random() * 1000)
        ),
        fetch(
          "https://robohash.org/random/" + Math.round(Math.random() * 1000)
        ),
        fetch(
          "https://robohash.org/random/" + Math.round(Math.random() * 1000)
        ),
      ]);
      const avatarsBlob = await Promise.all(
        avatarsResponse.map((response) => response.url)
      );
      const avatarsUrls = avatarsBlob.map((blob) => blob);
      setAvatars(avatarsUrls);
    };
    fetchAvatars();
  }, []);
  const handleSet = async () => {
    if (!selected) return;
    try {
      await axios.post(
        `${ENDPOINT}/upload-profile`,
        { profilepic: selected },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("token"))?.token
            }`,
          },
        }
      );
      const loginUser = await JSON.parse(localStorage.getItem("token"));
      loginUser.profilepic = selected;
      localStorage.setItem("token", JSON.stringify(loginUser));
      navigate("/chat");
    } catch (err) {
      toast.error("something went wrong");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f9f5eb",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Pick an avatar as your profile picture
      </h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {avatars.map((avatar, index) => (
          <div
            className={`${
              avatar === selected ? "selcted " : ""
            }image-container`}
            style={{ height: "100px", width: "100px" }}
          >
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
              style={{
                width: "70px",
                height: "70px",
                cursor: "pointer",
              }}
              onClick={() => setSelected(avatar)}
            />
          </div>
        ))}
      </div>
      <button
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "14px 20px",
          marginTop: "30px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "18px",
        }}
        onClick={handleSet}
      >
        Set as profile
      </button>
    </div>
  );
};

export default SelectLogo;
