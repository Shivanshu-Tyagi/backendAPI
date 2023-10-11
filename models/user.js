
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Mobile: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  referral_code: {
    type: String,
    required: true,
    unique: true
  },
  referral_point: {
    type: Number,
    default: 0
  },
  referral_link: {
    type: String
  },
  uniqueID: {
    type: String,
    unique: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
