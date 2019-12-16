const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "please add a name"]
  },
  lastname: {
    type: String
  },
  phone: {
    type: String,
    match: [
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      "Please add a valid phone number"
    ],
    unique: true,
    required: [true, "Please add a phone number"]
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6
  },
  photo: {
    type: String,
    default: "no-img.jpg"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedToken = function() {
  return jwt.sign({ id: this._id }, "4564564212", {
    expiresIn: "30d"
  });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = User = mongoose.model("users", UserSchema);
