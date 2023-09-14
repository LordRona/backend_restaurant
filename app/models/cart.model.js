const mongoose = require("mongoose");

require("./items.model")
const objectId = mongoose.Schema.Types.objectId;

const cartItems = mongoose.Schema({
    owner : {
        type: mongoose.Schema.Types.objectId,
         required: true,
         ref: 'User'
       },
      product: [{
        itemId: {
        type: objectId,
         ref: 'Product',
         required: true
      },
      name: String,
      quantity: {
         type: Number,
         required: true,
         min: 1,
         default: 1},
         price: Number
       }],
      bill: {
          type: Number,
          required: true,
         default: 0
        }
       
      },
      { 
        timestamps: true
      }
);

module.exports = mongoose.model("Cart", cartItems);