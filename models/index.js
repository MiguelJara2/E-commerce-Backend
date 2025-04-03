const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.clothes = require('./clothes.model');
db.cart = require('./cart.model');
db.payments = require('./payments.model');

db.ROLES = ["admin", "moderator", "user"];

module.exports = db;