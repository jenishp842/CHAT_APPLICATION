import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { ENDPOINT } from "../Endpoint";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${ENDPOINT}/login`, {
        email,
        password,
      })
      .then((response) => {
        const user = response.data.data.user;
        localStorage.setItem("token", JSON.stringify(user));
        if (!user.profilepic) {
          navigate("/select-icon");
          return;
        }
        toast.success("Login Successful!");
        navigate("/chat");
      })
      .catch((error) => {
        toast.error("Password is incorrect!");
      });
  };

  return (
    <div className="login">
      <h2 className="login__title">Login</h2>
      <form className="login__form" onSubmit={handleSubmit}>
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
          Login
        </button>
      </form>
      <Link to="/forget">Forgot Password?</Link>
    </div>
  );
};

export default Login;
