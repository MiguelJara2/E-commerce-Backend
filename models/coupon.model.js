const mongoose = require('mongoose');
const Coupon = mongoose.model(
    "Coupons",
    new mongoose.Schema({
        code: String,
        percentage: {
            type: Number,
            default: 0
        },
        expirationDate: {
            type: Date,
            required: true,
        },
    })
);

module.exports = Coupon;