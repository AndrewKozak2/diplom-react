const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, required: true },
  warehouse: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  cart: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      images: [String],
      bonus: Boolean,
      color: String,
      wheelColor: String,
    },
  ],
  total: { type: Number, required: true },
  promoCode: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
