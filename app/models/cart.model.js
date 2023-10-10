const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
     productIds: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Products'
     }],
     // Add other fields as needed
     user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: [true, "Please provide user"]
     },
     createdAt: {
       type: Date,
       default: Date.now
     }
   });

module.exports = mongoose.model("Cart", cartSchema);