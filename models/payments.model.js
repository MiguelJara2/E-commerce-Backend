const mongoose = require('mongoose');
const Payments = mongoose.model(
    "Payments",
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        paymentID: {
            type: String,
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
                
            }
        ],
        totalPrice: {
            type: Number,
            default: 0
        },
        paymentMethod: {
            type: String,
            enum: ["card"],
            required: true
        },
    })
);
module.exports = Payments;