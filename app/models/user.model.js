const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.objectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      minlength: 9,
      maxlength: 13,
      match: /^(237|00237)[0-9]{7,10}&/
    },
    password: {
      type: String,
    required: [true, "Please provide password!"],
    minLength: 7,
    trim: true,
    validate(value) {
       if( value.toLowerCase().includes("password")) {
       throw new Error("password musn’t contain 'password'!")
      }
   }
    },
    
    location:{
       type: String,
       required: true
    },
    
    tokens: [{
      token: {
      type: String,
      required: false
        }
      }],

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
