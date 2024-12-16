const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    phoneNumber: String,
    accountId: {
        type: Number,
        ref: 'Account'
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
