const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");
const { protect } = require("../../middleware");

router.post("/:receiverid", protect, async (req, res) => {
  const { body } = req.body;
  console.log(req.headers.authorization.startsWith("Bearer"));

  const message = await Message.create({
    body,
    receiver: req.params.receiverid,
    sender: req.user.id
  });
  res.status(200).json({ success: true, message: message });
});

/*$and: [
          { $or: [{a: 1}, {b: 1}] },
          { $or: [{c: 1}, {d: 1}] }
      ] */
router.get("/:receiverid", protect, async (req, res) => {
  senderid = req.user.id;
  receiverid = req.params.receiverid;
  const chat = await Message.find({
    $or: [
      { $and: [{ sender: senderid }, { receiver: receiverid }] },
      { $and: [{ sender: receiverid }, { receiver: senderid }] }
    ]
  }).sort({ createdat: -1 });

  res.status(200).json({ success: true, chat: chat });
});
module.exports = router;
