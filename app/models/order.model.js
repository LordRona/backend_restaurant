const mongoose = require("mongoose");

const orderSchema = mongoose.model("Order", new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    totalBill: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Please provide price!"]
    },
    productName: String,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status:{
        type: String,
        enum: ["pending", "failed", "delivered", "paid", "canceled"],
        default: "pending",
    },
  
},
{ timestamp: {
  type: Date,
  default: Date.now,
}, }
));

module.exports =  orderSchema 