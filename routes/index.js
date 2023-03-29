var express = require("express");
const { sendChat, getChat } = require("../controller/chat");
const {
  Login,
  Register,
  getUser,
  forgotPassword,
  uploadProfile,
} = require("../controller/user");
const { checkToken } = require("../middelware/auth");
var router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/forgot-password", forgotPassword);
router.use(checkToken);
router.post("/upload-profile", uploadProfile);
router.post("/get-user", getUser);
router.post("/send", sendChat);
router.post("/get-chat", getChat);

module.exports = router;
