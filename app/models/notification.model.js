const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide User id"],
    },
    message: {
        type: String,
        required: [true, "Please provide message"],
    }
},
{
    timestamps: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Notification", notificationSchema);