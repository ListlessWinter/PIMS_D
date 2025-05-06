const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  medicineId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  dosageForm: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  prescriptionRequired: { type: Boolean, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Inventory", InventorySchema);
