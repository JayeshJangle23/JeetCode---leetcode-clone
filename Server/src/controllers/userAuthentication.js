const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validate = require("../utils/validators");
const redisClient = require("../config/redis.js");
const Submission = require("../models/submission.js");
require("dotenv").config();

const register = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, email: emailId, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 1000 }
    );
    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({
      user: reply,
      message: "Loggin Successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR :- " + error);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("INVALID CREDENTIALS...");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS...");
    }
    const match = await bcrypt.compare(password, user.password);
    if (user.password == "" || !match) {
      throw new Error("INVALID Password...");
    }
    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };
    const token = jwt.sign(
      { _id: user._id, email: emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 1000 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).json({
      user: reply,
      message: "Loggin Successfully",
    });
  } catch (error) {
    res.status(401).send("ERROR :- " + error);
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send("LOGGED OUT SUCCESSFULLY...");
  } catch (error) {
    res.status(500).send("ERROR :- " + error);
  }
};

const getProfile = async (req, res) => {};

const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    // req.body.role = 'admin';

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, email: emailId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 1000 }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send("USER REGISTERED...");
  } catch (error) {
    res.status(400).send("ERROR :- " + error);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result?.id;
    await User.findByIdAndDelete(userId);
    Submission.deleteMany({ userId });

    res.status(200).send("DELETED SUCCESSFULLY ");
  } catch (error) {
    res.status(500).send("Internal Server Error ");
  }
};

module.exports = {
  adminRegister,
  register,
  login,
  logout,
  getProfile,
  deleteProfile,
};

