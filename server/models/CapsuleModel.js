const mongoose = require("mongoose");

const capsuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, default: "Hot Wheels" },
  image: { type: String, required: true },
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic"],
    default: "common",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CapsuleModel", capsuleSchema, "capsulemodels");

