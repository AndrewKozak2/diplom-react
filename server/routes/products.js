const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const BACKEND_URL = "https://truescale.up.railway.app"; 

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithFullImages = products.map(product => {
      const p = product.toObject();
      p.images = p.images.map(img => BACKEND_URL + img);
      return p;
    });

    res.json(productsWithFullImages);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося отримати товари' });
  }
});

module.exports = router;
