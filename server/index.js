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

// ✅ Permanent allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://jeet-code-leetcode-clone.vercel.app", // main frontend
];

// ✅ Universal CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin &&
    (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app"))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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

// ✅ Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

app.get("/", (req, res) => {
  res.send("✅ Backend running fine with permanent CORS setup!");
});

// ✅ Initialize connection
const InitializeConnection = async () => {
  try {
    await main();
    console.log("✅ MongoDB connected");
    await redisClient.connect();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
  } catch (err) {
    console.error("❌ Initialization failed:", err);
    process.exit(1);
  }
};

InitializeConnection();
