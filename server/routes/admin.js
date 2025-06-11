const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyAdmin } = require("../middlewares/auth");
const upload = require("../uploadConfig");

router.post(
  "/products",
  verifyAdmin,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { name, brand, price, scale, inStock } = req.body;
      const images = req.files.map((file) =>
        file.path.replace(/^public/, "").replace(/\\/g, "/")
      );

      const newProduct = new Product({
        name,
        brand,
        price,
        scale,
        inStock,
        images,
      });

      await newProduct.save();
      res
        .status(201)
        .json({ message: "Товар додано успішно", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Помилка при додаванні товару", error });
    }
  }
);

router.put(
  "/products/:id",
  verifyAdmin,
  upload.array("newImages", 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, brand, price, scale, inStock, existingImages } = req.body;

      let parsedExistingImages = [];

      if (typeof existingImages === "string") {
        try {
          parsedExistingImages = JSON.parse(existingImages);
        } catch (err) {
          parsedExistingImages = [];
        }
      } else if (Array.isArray(existingImages)) {
        parsedExistingImages = existingImages;
      }

      const newUploadedImages = req.files.map((file) =>
        file.path.replace(/^public/, "").replace(/\\/g, "/")
      );

      const allImages = [...parsedExistingImages, ...newUploadedImages];

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          brand,
          price,
          scale,
          inStock,
          images: allImages,
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Товар не знайдено" });
      }

      res.json({ message: "Товар оновлено", product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Помилка при оновленні товару", error });
    }
  }
);

module.exports = router;
