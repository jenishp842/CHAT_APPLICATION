const { findByIdAndUpdate } = require("../model/chat");
const User = require("../model/user");
const catchAsync = require("../utils/catchAsync");
const { sendResponse, sendError } = require("../utils/sendresponse");

// register user

exports.Register = catchAsync(async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    sendResponse(res, 201, user);
  } catch (err) {
    throw err;
  }
});

exports.Login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return sendError(res, 404, "email or password is incorrect");
  }
  const comparePassword = await user.comparePassword(req.body.password);
  if (!comparePassword) {
    return sendError(res, 404, "email or password is incorrcet");
  }
  const token = user.getJwt();
  user._doc.token = token;
  return sendResponse(res, 200, { user });
});

exports.documentUpload = catchAsync(async (req, res) => {
  console.log(req);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user } }).lean();
  return sendResponse(res, 200, {
    users: users.map((item) => ({
      ...item,
      online: !!global.customerObj[item._id]
    }))
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return sendError(res, 400, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, 404, "Can't found user with this email");
  }
  const comparePassword = await user.comparePassword(password);
  if (comparePassword) {
    return sendError(res, 404, "Password should not be same as last password");
  }
  user.password = password;
  await user.save();
  sendResponse(res, 200, "successfull");
});

exports.uploadProfile = catchAsync(async (req, res) => {
  const { profilepic } = req.body;
  if (!profilepic) {
    return sendError(res, 400, "Profile image is required");
  }
  console.log(profilepic, req.user);
  await User.findByIdAndUpdate(req.user, { profilepic });
  sendResponse(res, 200, "successfull");
});
