const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const path = require("path");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profilePic = req.file;

    if (!name || !email || !password || !profilePic) {
      return res.send("All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("Email already registered.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic.filename
    });

    await newUser.save();

    await sendEmail(
      email,
      "Welcome to the App 🎉",
      `<h2>Hello ${name}</h2><p>Thanks for registering!</p>`
    );

    res.render("success", { name });
  } catch (error) {
    console.error(error);
    res.send("Something went wrong.");
  }
};

// Temporary dummy login controller
exports.login = (req, res) => {
  res.send("Login functionality coming soon!");
};
