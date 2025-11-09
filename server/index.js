require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const main = require("./config/db");
const redisClient = require("./config/redis");
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreater");

const app = express();

// ✅ Step 1: Define allowed origins
const allowedOrigins = [
  "https://jeet-code-leetcode-clone.vercel.app", // your frontend on Vercel
  "http://localhost:5173", // local dev
];

// ✅ Step 2: CORS middleware (place BEFORE all routes)
app.use(
  cors({
    origin: [
      "https://jeet-code-leetcode-clone.vercel.app",
      "https://jeet-code-leetcode-clone-1kt4heijh-jayeshjangle23s-projects.vercel.app", // ✅ new vercel URL
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Step 3: Routers
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// ✅ Step 4: Root test route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and running successfully with proper CORS!");
});

// ✅ Step 5: Initialize
const InitializeConnection = async () => {
  try {
    await main();
    console.log("✅ Database connected");
    await redisClient.connect();
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("❌ Server initialization failed:", err);
  }
};

InitializeConnection();
