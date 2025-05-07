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
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://pims-d-f.vercel.app", "https://docsys.onrender.com", "https://docsys.onrender.com/home"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.options("*", cors()); // ✅ Allow preflight

app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);

// MongoDB Connection
mongoose.connect('mongodb+srv://Dolera:april123@cluster0.fp1ojbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB fails
});

// Root Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// CRUD for Inventory
app.post("/inventory", async (req, res) => {
    try {
      const newItem = new Inventory(req.body);
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (err) {
      res.status(400).json({ message: "Error creating item", error: err });
    }
});

app.get("/inventory", async (req, res) => {
    try {
      const items = await Inventory.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: "Error fetching items", error: err });
    }
});

app.put("/inventory/:id", async (req, res) => {
    try {
      const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: "Error updating item", error: err });
    }
});

app.delete("/inventory/:id", async (req, res) => {
    try {
      await Inventory.findByIdAndDelete(req.params.id);
      res.json({ message: "Item deleted" });
    } catch (err) {
      res.status(400).json({ message: "Error deleting item", error: err });
    }
});

// Ignore favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
