const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUser } = require("../middlewares/auth");

router.post("/save", verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleanedCart = (req.body.cart || []).map((item) => ({
      id: item.id || "",
      name: item.name || "Unnamed",
      price: typeof item.price === "number" ? item.price : 0,
      quantity:
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        item.quantity <= 99
          ? item.quantity
          : 1,
      images: Array.isArray(item.images) ? item.images : [],
      brand: item.brand || "Unknown",
      scale: item.scale || "1/64",
    }));

    user.cart = cleanedCart;
    await user.save();

    res.status(200).json({ message: "Cart saved" });
  } catch (err) {
    console.error(" Save cart error:", err);
    res.status(500).json({ message: "Error saving cart" });
  }
});

router.get("/load", verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart });
  } catch (err) {
    console.error(" Load cart error:", err);
    res.status(500).json({ message: "Error loading cart" });
  }
});

router.patch("/clear", verifyUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error(" Clear cart error:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;
