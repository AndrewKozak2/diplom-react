const express = require("express");
const router = express.Router();
const PromoCode = require("../models/PromoCode");
const { verifyAdmin } = require("../middlewares/auth");

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    console.error("Error loading promo codes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/public", async (req, res) => {
  try {
    const codes = await PromoCode.find({}, "code type value");
    res.json(codes);
  } catch (err) {
    console.error("Error loading public promo codes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { code, type, value, maxUsage, expiresAt } = req.body;

    const newPromo = new PromoCode({
      code: code.toUpperCase(),
      type,
      value,
      maxUsage: maxUsage || null,
      expiresAt: expiresAt || null,
    });

    await newPromo.save();
    res.status(201).json(newPromo);
  } catch (err) {
    console.error("Error creating promo code:", err);
    res.status(500).json({ message: "Failed to create promo code" });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
