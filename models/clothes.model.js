const mongoose= require('mongoose');
const Clothes = mongoose.model(
    "Clothes",
    new mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        category: String,
        stock: Number,
        identity:Number
    })
);
module.exports = Clothes;