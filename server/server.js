const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders'); 
const userRoutes = require('./routes/user');
const passwordResetRoutes = require('./routes/passwordReset');
const registerVerificationRoutes = require('./routes/registerVerification');
const limitedRoutes = require("./routes/limited");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));
console.log('Registering auth routes...');

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/limited", limitedRoutes);
app.use('/api', passwordResetRoutes);
app.use('/api', registerVerificationRoutes);
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes); 


mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/latest', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(3);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
