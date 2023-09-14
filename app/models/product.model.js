const mongoose = require("mongoose");

const products = new mongoose.Schema({
    name: { 
        type: String, 
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Name can not be more than 100 characters"]
    },
    description: { 
        type: String,
        required: [true, "Please provide product description"],
        maxlength: [1000, "Decription can not exceed 1000 characters"],

    },
    price: { 
        type: Number,
        required: [true, "Please provide price"],
        default: 0,
    },
    image: {
        type: String,
        default: "/uploads/example.jpeg",
        },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    freeShipping: {
        type: Boolean,
        default: false,
        },
    averageRating: {
        type: Number,
        default: 0,
        },
  });
  
  const Product = mongoose.model('Product', products);
  
  module.exports = Product;