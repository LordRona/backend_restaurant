const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.product = require("./product.model");
db.category = require("./category.model");

db.ROLES = ["user", "admin", "moderator"];
db.CATEGORIES = ["all", "children", "adults", "african", "foriegn", "fruits"];

module.exports = db;