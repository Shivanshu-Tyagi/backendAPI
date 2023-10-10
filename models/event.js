const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  name: String,
  address: String,
  pincode: String,
  mobile: String
});

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
