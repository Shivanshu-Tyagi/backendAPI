const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  house: String,
  area: { type: String, required: true },
  landmark: { type: String, required: true },
  pincode: { type: String, required: true },
  town: { type: String, required: true },
  state: { type: String, required: true },
  product: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
