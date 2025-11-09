require("dotenv").config();
const express = require("express");
const app = express();

// Set environment variables directly if not loaded
if (!process.env.PORT) {
  process.env.PORT = "3000";
}

const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreater");
const cors = require("cors");
const path = require("path");

// const projectRoot = path.resolve();

app.use(
  cors({
    // origin: "https://jeetcode-3qnq.onrender.com",
    origin : ["https://jeet-code-leetcode-clone.vercel.app","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.options("*", cors());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video",videoRouter);


// app.use(express.static(path.join(projectRoot, "/client/dist")));
// app.get(/\/(.*)/, (req, res) => {
//   console.log("Catch-all route triggered for:", req.path);
//   res.sendFile(path.join(projectRoot, "client", "dist", "index.html"));
// });

app.get("/", (req, res) => {
  res.send("✅ Backend is live and running successfully!");
});


const InitalizeConnection = async () => {
  try {
    await main(); // Only connect to MongoDB for now
    console.log("✅ Database connection established");
    await redisClient.connect();
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        "🚀 Server listening at port number: " + (process.env.PORT || 3000)
      );
    });
  } catch (err) {
    console.error("❌ Server initialization failed:", err.message);
    console.error("Full error:", err);
    process.exit(1); // Exit the process if database connection fails
  }
};

InitalizeConnection();
