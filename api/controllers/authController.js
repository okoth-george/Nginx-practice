const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// REGISTER
exports.register = async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    password: hashed
  });

  await user.save();
  res.json({ message: "User created" });
};

// LOGIN
let refreshTokens = []; // (for learning; later use DB or Redis)

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

   // ACCESS TOKEN (short life)
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // REFRESH TOKEN (long life)
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  refreshTokens.push(refreshToken);

  res.json({
    accessToken,
    refreshToken
  });
};


exports.refreshToken = (req, res) => {
  const token = req.body.token;

  if (!token) return res.status(401).json({ error: "No token" });
  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ error: "Token expired or invalid" });
  }
};