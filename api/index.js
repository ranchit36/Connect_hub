const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const announcementRoute = require("./routes/announcement"); // Import the announcement routes
const departmentRoute = require("./routes/department"); // Import the department routes
const studentOrganizationRoutes = require("./routes/studentOrganizationRoutes");
const eventRoutes = require("./routes/eventRoutes");
const internshipRoutes = require("./routes/internships");
const qaRoute = require("./routes/qa");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const remedialRoute = require("./routes/remedial");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Add connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Serve images statically
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Serve documents statically
app.use("/documents", express.static(path.join(__dirname, "public/documents")));

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json("File upload failed");
  }
});

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/announcements", announcementRoute); // Add announcement route
app.use("/api/departments", departmentRoute); // Add department route
app.use("/api/clubs", studentOrganizationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/internships",internshipRoutes);
app.use("/api/qa", qaRoute);
app.use("/api/remedial", remedialRoute);

// Test routes
app.get("/", (req, res) => {
  res.send("Welcome to home");
});

app.get("/users", (req, res) => {
  res.send("Welcome to home user");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(8800, () => {
  console.log("Backend server is running on port 8800");
});
