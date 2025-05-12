const express = require("express");
const router = express.Router();
const CapsuleModel = require("../models/CapsuleModel");

router.get("/random", async (req, res) => {
  try {
    const failChance = 0.7;
    if (Math.random() < failChance) {
      return res.json({ success: false });
    }

    const all = await CapsuleModel.find();
    if (!all.length) return res.json({ success: false });

    const rarityWeights = {
      common: 60,
      uncommon: 25,
      rare: 10,
      epic: 5,
    };

    const weighted = all.flatMap((item) =>
      Array(rarityWeights[item.rarity] || 1).fill(item)
    );

    const dropped = weighted[Math.floor(Math.random() * weighted.length)];

    return res.json({ success: true, model: dropped });
  } catch (err) {
    console.error("❌ Capsule drop error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const models = await CapsuleModel.find();
    res.json(models);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch capsule models" });
  }
});

module.exports = router;
