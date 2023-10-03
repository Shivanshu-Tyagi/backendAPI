const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: String,  // e.g., "500g", "1kg", etc.
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
