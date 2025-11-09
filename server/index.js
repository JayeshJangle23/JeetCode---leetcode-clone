require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const main = require("./config/db");
const redisClient = require("./config/redis");

const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreater");

// Set default port if not defined
const PORT = process.env.PORT || 3000;

// ✅ CORS Configuration (Render + Vercel Friendly)
const allowedOrigins = [
  "https://jeet-code-leetcode-clone.vercel.app", // Frontend (Vercel)
  "http://localhost:5173", // Local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Must be BEFORE routes
app.options("*", cors());

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// ✅ Simple health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and running successfully!");
});

// ✅ Initialize database + Redis + start server
const initializeConnection = async () => {
  try {
    await main();
    console.log("✅ Database connection established");

    await redisClient.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Server listening at port number: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server initialization failed:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  }
};

initializeConnection();
