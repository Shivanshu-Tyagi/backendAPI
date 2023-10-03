const mongoose = require('mongoose');

const refralSchema = new mongoose.Schema({
    username: String,
    referralLink: String,
    walletBalance: Number
});

const Refral = mongoose.model('Refral', refralSchema);

module.exports = Refral;
