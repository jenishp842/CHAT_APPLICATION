var express = require("express");
const { sendChat, getChat, createGroup } = require("../controller/chat");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'myfiles');
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  }),
});

const {
  Login,
  Register,
  getUser,
  forgotPassword,
  uploadProfile,
  documentUpload,
} = require("../controller/user");
const { checkToken } = require("../middelware/auth");
const { route } = require("../app");
var router = express.Router();

router.post("/login", Login);
router.post("/doc-upload", upload.single("profile"), documentUpload);
router.post("/register", Register);
router.post("/forgot-password", forgotPassword);
router.use(checkToken);
router.post("/upload-profile", uploadProfile);
router.post("/get-user", getUser);
router.post("/send", sendChat);
router.post("/get-chat", getChat);
router.post("/create-group",createGroup)

module.exports = router;
