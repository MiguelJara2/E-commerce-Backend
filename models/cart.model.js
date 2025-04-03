const mongoose = require('mongoose');
const Cart = mongoose.model(
    "Cart",
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Clothes',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                },
                identity: {
                    type: Number,
                    required: true
                },
            }
        ],
        totalPrice: {
            type: Number,
            default: 0
        },
    })
);

module.exports = Cart;