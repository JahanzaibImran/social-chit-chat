const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill All Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.json({
      status: 400,
      success: false,
      message: "User Already Exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    photo,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    let isPasswordMatch = await user.matchPassword(password);

    if (isPasswordMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).send("Password Is Incorrect");
    }
  } else {
    res.status(400).send("User Not Found");
  }
});

/**
 * User Search
 */
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json({
    data: users,
    status: 201,
    success: true,
  });
});

module.exports = { registerUser, allUsers, authUser };
