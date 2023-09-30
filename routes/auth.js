const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Order = require('../models/order');

const router = express.Router();

// Generate a unique ID
function generateUniqueID() {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return `${timestamp}${randomString}`;
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const uniqueID = generateUniqueID();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      uniqueID
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/order', async (req, res) => {
  const orderDetails = req.body;

  try {
    console.log('Received order data:', orderDetails);  // Log order data

    const order = new Order(orderDetails);
    await order.save();  // Save the order to the database

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error saving order:', error);  // Log the error
    res.status(400).json({ message: error.message });
  }
});
router.post('/updatePrice', async (req, res) => {
  const productId = req.body.productId;
  const newPrice = req.body.newPrice;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { price: newPrice } },
      { new: true }
    );

    if (!product) {
      return res.status(404).send('Product not found.');
    }

    return res.status(200).json('Price updated successfully.');
  } catch (error) {
    console.error('Error updating price:', error);
    return res.status(500).send('Internal server error.');
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
