import React, { useState, useEffect } from "react";

const SelectLogo = () => {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarsResponse = await Promise.all([
        fetch("https://api.multiavatar.com/" + Math.round(Math.random() * 1000)),
        fetch("https://api.multiavatar.com/" + Math.round(Math.random() * 1000)),
        fetch("https://api.multiavatar.com/" + Math.round(Math.random() * 1000)),
        fetch("https://api.multiavatar.com/" + Math.round(Math.random() * 1000)),
      ]);
      const avatarsBlob = await Promise.all(
        avatarsResponse.map((response) => response.blob())
      );
      const avatarsUrls = avatarsBlob.map((blob) =>
        URL.createObjectURL(blob)
      );
      setAvatars(avatarsUrls);
    };
    fetchAvatars();
  }, []);

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
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index}`}
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
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
      >
        Profile Picture
      </button>
    </div>
  );
};

export default SelectLogo;
