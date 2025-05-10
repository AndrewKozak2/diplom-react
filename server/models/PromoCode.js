const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["percent", "fixed", "shipping", "gift"],
    required: true,
  },
  value: { type: Number, required: true },
  usageCount: { type: Number, default: 0 },
  usedBy: [
    {
      email: String,
      usedAt: Date,
    },
  ],
  expiresAt: {
    type: Date,
    default: null,
  },
  maxUsage: {
    type: Number,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
