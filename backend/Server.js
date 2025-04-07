const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();
const notificationsRoute = require('./Routes/notifications');
app.use('/api', notificationsRoute);
app.use(bodyParser.json({ limit: '10mb' })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
const userRoutes = require("./Routes/userRoutes"); 

// Import Routes
const authRoutes = require("./Routes/AuthRouter");

//const app = express(); // ✅ FIXED: app defined here

// Middleware
app.use(cors({ origin: "http://localhost:3000", methods: "GET,POST,PUT,DELETE", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api",notificationsRoute)

// ✅ Correcting Route Position
app.use("/auth", authRoutes); // ✅ Moved here after app declaration

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/testDB";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;

// ✅ JWT Token Generator
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "1d",
  });
};

// ✅ Auth Middleware (Protect Route)
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// ✅ Signup Route
app.post("/auth/signup", upload.single("profilePicture"), async (req, res) => {
  try {
    const { fullName, username, email, mobile, password, confirmPassword } = req.body;

    if (!fullName || !username || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicturePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newUser = new User({
      fullName,
      username,
      email,
      mobile,
      password: hashedPassword,
      profilePicture: profilePicturePath,
    });

    await newUser.save();

    const token = generateToken(newUser._id);
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, fullName, email, profilePicture: profilePicturePath },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Login Route
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, email: user.email, profilePicture: user.profilePicture },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Fetch User Data (Protected)
app.get("/auth/user", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Fetch User Data Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Logout Route
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// ✅ Predict Route (ML Integration)
app.post("/predict", authenticateUser, async (req, res) => {
  const { skills } = req.body;
  const recommendedCareer = "Software Engineer"; // Placeholder
  res.status(200).json({ recommended_career: recommendedCareer });
});

// ✅ Ping Route
app.get("/ping", (req, res) => {
  res.json({ message: "🏓 Pong from the backend" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
