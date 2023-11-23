const mongoose = require("mongoose");


const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user id"]
    },
    tokens: [{
        token: {
        type: String,
        required: false
          }
        }],
});

module.exports = mongoose.model("Token", tokenSchema);