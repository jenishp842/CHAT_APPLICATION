const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/user");
const { sendError } = require("../utils/sendresponse");

exports.checkToken = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    const token = authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // const userDet = await User.findById(user.id);
    req.user = user.id;
  } else {
    return sendError(res, 401, "please login");
  }
  next();
});
