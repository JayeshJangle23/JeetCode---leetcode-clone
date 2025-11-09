require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const main = require("./config/db");
const redisClient = require("./config/redis");
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreater");

const app = express();

/* ✅ Step 1: Custom CORS middleware that handles ALL requests (including OPTIONS) */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow localhost and any vercel.app frontend
  const allowedOrigins = [
    "http://localhost:5173",
    "https://jeet-code-leetcode-clone.vercel.app",
  ];

  if (
    origin &&
    (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // ✅ Important: Send 200 immediately for preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

/* ✅ Step 2: API Routes */
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

/* ✅ Step 3: Health Check Route */
app.get("/", (req, res) => {
  res.send("✅ Backend is live and running with full CORS support!");
});

/* ✅ Step 4: Initialize server */
const InitializeConnection = async () => {
  try {
    await main();
    console.log("✅ MongoDB connected");
    await redisClient.connect();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Initialization failed:", err);
    process.exit(1);
  }
};

InitializeConnection();
