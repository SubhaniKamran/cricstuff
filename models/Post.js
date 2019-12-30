const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  seriesType: {
    type: String,
    required: [true, "Please add a Name"]
  },
  matchType: {
    type: String,
    required: [true, "Please add a Description"],
    maxlength: [500, "Description cannot be more then 500 chrachters"]
  },
  name: {
    type: String,
    required: [true, "Please add a Description"]
  },
  salePrice: {
    type: Number,
    required: [true, "Please add a Description"]
  },
  actualPrice: {
    type: Number,
    required: [true, "Please add a Description"]
  },
  image: {
    type: [String],
    default: ["no-photo.jpg"]
  },
  status: {
    type: String,
    required: [true, "Please add an address"]
  },
  remaining: Number,
  quantity: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Post", PostSchema);
