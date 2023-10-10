const mongoose = require("mongoose");

const SingleOrderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    tax: {
        type: Number,
        required: true,
      },
      shippingFee: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
    adress: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    total: {
        type: Number,
        required: true,
      },
    orderItems: [SingleOrderItemSchema],
    status:{
        type: String,
        enum: ["pending", "failed", "delivered", "paid", "canceled"],
        default: "pending",
    }

},
{ timestamp: true, }
);

module.exports = mongoose.model("Order", orderSchema);