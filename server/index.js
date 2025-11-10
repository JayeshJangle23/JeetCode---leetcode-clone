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

// ✅ Step 1: Universal CORS Middleware (before routes)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "http://localhost:5173",
    "https://jeet-code-leetcode-clone.vercel.app",
  ];

  // ✅ Allow all vercel preview URLs automatically
  if (
    origin &&
    (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

// ✅ Step 2: Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// ✅ Step 3: Root route (for Render test)
app.get("/", (req, res) => {
  res.send("✅ Backend running fine with CORS!");
});

// ✅ Step 4: Global error handler (ensures CORS headers even on error)
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Step 5: Initialize connections
const InitializeConnection = async () => {
  try {
    await main();
    console.log("✅ MongoDB connected");
    await redisClient.connect();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Initialization failed:", err);
    process.exit(1);
  }
};

InitializeConnection();
