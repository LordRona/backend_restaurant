const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.objectId;

const itemSchema = mongoose.Schema({
   owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
   },
   name:{
    type: String,
    required: true,
    trim: true
   },
   description: {
     type: String,
     required: true
   },
   category: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   }
   , 
  // timestamps: true

})

module.exports = mongoose.model("Items", itemSchema)