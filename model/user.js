const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "passwprd should be greater "],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilepic: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "vendor", "admin"],
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
UserSchema.methods.comparePassword = async function (userpassword) {
  return await bcrypt.compare(userpassword, this.password);
};
UserSchema.methods.getJwt = function () {
  return jwt.sign({ name: this.name, id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
module.exports = mongoose.model("User", UserSchema);
