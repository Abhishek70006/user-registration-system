const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authController = require("../controllers/authController");

// Multer setup for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});

// 👉 Register routes
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", upload.single("profilePic"), authController.register);

// 👉 Login routes (add these 👇)
router.get("/Login", (req, res) => {
  res.render("Login", { error: null });
});

router.post("/Login", authController.login);

module.exports = router;
