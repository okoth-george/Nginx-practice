const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB();
app.get("/api/items", (req, res) => {
  res.json({
    server: process.env.SERVER_NAME,
    items: []
  });
});
// routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});