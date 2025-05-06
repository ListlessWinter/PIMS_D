require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

const authRoutes = require("./routes/auth");
const Inventory = require("./models/inventory");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://pims-d-f.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Server Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// Create inventory item
app.post("/inventory", async (req, res) => {
    try {
      const newItem = new Inventory(req.body);
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (err) {
      res.status(400).json({ message: "Error creating item", error: err });
    }
  });
  
  // Read all inventory items
  app.get("/inventory", async (req, res) => {
    try {
      const items = await Inventory.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: "Error fetching items", error: err });
    }
  });
  
  // Update item
  app.put("/inventory/:id", async (req, res) => {
    try {
      const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Error updating item", error: err });
    }
  });
  
  // Delete item
  app.delete("/inventory/:id", async (req, res) => {
    try {
      await Inventory.findByIdAndDelete(req.params.id);
      res.json({ message: "Item deleted" });
    } catch (err) {
      res.status(400).json({ message: "Error deleting item", error: err });
    }
  });