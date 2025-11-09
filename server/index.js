require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreater");

const main = require("./config/db");
const redisClient = require("./config/redis");

// ✅ Use proper CORS configuration
app.use(
  cors({
    origin: [
      "https://jeet-code-leetcode-clone.vercel.app", // your Vercel frontend
      "http://localhost:5173", // local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests (important!)
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and running successfully!");
});

// ✅ Connect DB + start server
const InitializeConnection = async () => {
  try {
    await main();
    console.log("✅ Database connection established");
    await redisClient.connect();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("❌ Server initialization failed:", err.message);
    process.exit(1);
  }
};

InitializeConnection();
