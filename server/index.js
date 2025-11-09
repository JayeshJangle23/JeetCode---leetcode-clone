require("dotenv").config();
const express = require("express");
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

// ✅ Step 1: Dynamic CORS Middleware (no need to edit for each deploy)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allowed base origins (permanent)
  const allowedOrigins = [
    "http://localhost:5173",
    "https://jeet-code-leetcode-clone.vercel.app",
  ];

  // ✅ Allow any *.vercel.app subdomain automatically
  if (
    origin &&
    (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

// ✅ Step 2: Routers
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// ✅ Step 3: Root test route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and running successfully with dynamic CORS!");
});

// ✅ Step 4: Initialize Database + Redis + Server
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
