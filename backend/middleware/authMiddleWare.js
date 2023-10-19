const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      res.json({
        status: 401,
        success: false,
        message: "Not Authorized, Token Failed",
      });
    }
  }
  if (!token) {
    res.json({
      status: 401,
      success: false,
      message: "Not Authorized, Token Failed",
    });
  }
});

module.exports = { protect };
