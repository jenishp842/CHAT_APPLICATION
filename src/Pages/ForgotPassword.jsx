import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINT } from "../Endpoint";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    axios
      .post(`${ENDPOINT}/forgot-password`, {
        email,
        password:newPassword,
      })
      .then(() => {
        toast.success("Password reset successful!");
      })
      .catch((error) => {
        toast.error("Error resetting password!");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Enter your email address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="new-password">Enter a new password:</label>
        <input
          type="password"
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm your new password:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit">Reset password</button>
    </form>
  );
};

export default ForgotPassword;
