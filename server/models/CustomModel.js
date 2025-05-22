const mongoose = require("mongoose");

const CustomModelSchema = new mongoose.Schema({
  baseId: { type: String,
    required: true },
  color: {
    type: String,
    required: true,
  },
  wheelColor: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CustomModel", CustomModelSchema);
