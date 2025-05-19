const express = require("express");
const router = express.Router();
const CustomModel = require("../models/CustomModel");

router.post("/", async (req, res) => {
  try {
    const { baseId, color, wheelColor, image, price, userId } = req.body;

    if (!baseId || !color || !image || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCustomModel = new CustomModel({
      baseId,
      color,
      wheelColor,
      image,
      price,
      userId: userId || null,
      createdAt: new Date(),
    });

    await newCustomModel.save();
    res.status(201).json(newCustomModel);
  } catch (error) {
    console.error("❌ Failed to save custom model:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
