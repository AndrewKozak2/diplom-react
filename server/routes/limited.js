const express = require("express");
const router = express.Router();
const LimitedProduct = require("../models/LimitedProduct");


router.get("/", async (req, res) => {
  const product = await LimitedProduct.findOne(); 
  res.json(product);
});

router.post("/reduce", async (req, res) => {
    const { brand, quantity } = req.body;
  
    try {
      const product = await LimitedProduct.findOne({ brand });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (product.countInStock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
  
      product.countInStock -= quantity;
      await product.save();
  
      res.json({ message: "Stock reduced" });
    } catch (error) {
      console.error("❌ Error reducing limited stock:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  

module.exports = router;
