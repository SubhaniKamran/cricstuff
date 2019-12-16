const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const MessageSchema = new Schema({
  body: {
    type: String,
    required: [true, "please enter message"]
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  createdat: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model("messages", MessageSchema);
