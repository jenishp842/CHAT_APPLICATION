import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./Pages/Chat";
import ForgotPassword from "./Pages/ForgotPassword";
// import Grid from "./Pages/Grid";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SelectLogo from "./Pages/SelectLogo";

function App() {
  return (
    <Router>
      <ToastContainer />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/select-icon" element={<SelectLogo />} />
          <Route exact path="/forget" element={<ForgotPassword />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/chat" element={<Chat />} />
          {/* <Route exact path="/grid" element={<Grid />} /> */}
        </Routes>
    </Router>
  );
}

export default App;
