const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyAdmin } = require('../middlewares/auth');


router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const { name, brand, price, scale, image, inStock } = req.body;

    const newProduct = new Product({
      name,
      brand,
      price,
      scale,
      image,
      inStock
    });

    await newProduct.save();
    res.status(201).json({ message: 'Товар додано успішно', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при додаванні товару', error });
  }
});


router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }

    res.json({ message: 'Товар оновлено', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні товару', error });
  }
});

module.exports = router;
