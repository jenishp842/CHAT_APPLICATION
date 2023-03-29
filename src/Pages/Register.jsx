import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { ENDPOINT } from "../Endpoint";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${ENDPOINT}/register`,
        {
          email: email,
          password: password,
          name: username,
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Registration Successful!");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Already User Exist");
      });
  };

  return (
    <div className="login">
      <h2 className="login__title">Register</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            className="form-input"
            type="text"
            id="user"
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login__button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
