const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Order = require('../models/order');
const Refral = require('../models/refral');
const router = express.Router();

// Generate a unique ID
function generateUniqueID() {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return `${timestamp}${randomString}`;
}
const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referralCode = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }

  console.log('Generated referral code:', referralCode);
  return referralCode;
};

router.post('/register', async (req, res) => {
    const { fullname, username, email, password, referralcode } = req.body;
  
    let referredByUser = null;
  
    if (referralcode) {
      try {
        referredByUser = await User.findOne({ referral_code: referralcode });
  
        if (!referredByUser) {
          return res.status(400).json({ error: 'Invalid referral code.' });
        }
  
        // Increment points for the referrer and the referee
        referredByUser.referral_point += 200;  // Referrer gets 200 points
        await referredByUser.save();  // Await the save operation
  
        // Create the new user with a generated referral code and assign 100 points for using a referral code
        const newUser = new User({
          fullname: fullname,
          username,
          email,
          password,
          referral_code: generateReferralCode(),
          referral_point: 100,  // User using a referral code gets 100 points
        });
  
        await newUser.save();
        res.json({ message: 'User registered successfully.' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    } else {
      // If no referral code is provided, proceed with normal registration
      const newUser = new User({
        fullname: fullname,
        username,
        email,
        password,
        referral_code: generateReferralCode(),
        referral_point: 0,
      });
  
      try {
        await newUser.save();
           // Update the referral link for the new user
           let referralLink = `http://127.0.0.1:5500/index.html?referralcode=${newUser.referral_code}`;
           await User.updateOne({ _id: newUser._id }, { referral_link: referralLink });
         
           res.json({
             message: 'User registered successfully.',
             userInfo: {
               name: newUser.fullname,
               username: newUser.username,
               email: newUser.email,
               referralCode: newUser.referral_code,
               referralPoints: newUser.referral_point,
               referralLink: referralLink  // Include referralLink in the userInfo object
             }
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  });
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    res.json({
      message: `Welcome to this page, ${user.username}`,
      userInfo: {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        referralCode: user.referral_code,
        referralPoints: user.referral_point
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  const { productId, newPrice, newQuantity } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { price: newPrice, quantity: newQuantity } },
      { new: true }
    );

    if (!product) {
      return res.status(404).send('Product not found.');
    }

    return res.status(200).json('Price and quantity updated successfully.');
  } catch (error) {
    console.error('Error updating price and quantity:', error);
    return res.status(500).send('Internal server error.');
  }
});

router.get('/user/details/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: 'User details retrieved successfully.',
      userInfo: {
        name: user.fullname,
        username: user.username,
        email: user.email,
        referralCode: user.referral_code,
        referralPoints: user.referral_point,
        referralLink: user.referral_link 
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
