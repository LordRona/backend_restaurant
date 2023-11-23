const mongoose = require("mongoose");

const products = new mongoose.Schema({
    name: { 
        type: String, 
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Name can not be more than 100 characters"]
    },
    // description: { 
    //     type: String,
    //     required: [true, "Please provide product description"],
    //     maxlength: [1000, "Decription can not exceed 1000 characters"],
    // },
    price: { 
        type: Number,
        required: [true, "Please provide price"],
        default: 0,
    },
    // category: {
    //     type: String,
    //     ref: "Category",
    //     required: [true, "Please provide category field"],
    //     enum: ["all", "fruits", "african", "foriegn"],
    //     default: "all"
    // },
    image: {
        type: String,
        default: "/uploads/example.jpeg",
        },
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide User id"],
        ref: 'User' 
    },
    key: {
        type: String,
        required: true,
    },
    ownerLocation: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
  }, { timestamps: true });
  products.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
  });
  
  products.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
  });

  const Product = mongoose.model("Products", products);

  
  module.exports = Product;