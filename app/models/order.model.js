const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
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
    // tokenAddress: {
    //   type: String,
    // }
},
{ timestamp: {
  type: Date,
  default: Date.now,
}, }
);

module.exports = mongoose.model("Order", orderSchema);