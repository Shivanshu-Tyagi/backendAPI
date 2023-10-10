const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  mobile: { type: String, required: true }
});

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
