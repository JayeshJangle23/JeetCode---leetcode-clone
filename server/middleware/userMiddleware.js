const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

// ✅ Allowed origins (both frontend and local dev)
const allowedOrigins = [
  "https://jeet-code-leetcode-clone.vercel.app",
  "http://localhost:5173"
];

// ✅ Helper to always send CORS headers (even in error)
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token is not present");

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;
    if (!_id) throw new Error("Invalid token");

    const result = await User.findById(_id);
    if (!result) throw new Error("User Doesn't Exist");

    const IsBlocked = await redisClient.exists(`token:${token}`);
    if (IsBlocked) throw new Error("Invalid Token");

    req.result = result;
    next();
  } catch (err) {
    setCorsHeaders(req, res); // ✅ Always include CORS headers in error
    res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};

module.exports = userMiddleware;
