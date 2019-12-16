const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");

router.post("/:senderid/:receiverid", async (req, res) => {
  const { body } = req.body;

  const message = await Message.create({
    body,
    receiver: req.params.receiverid,
    sender: req.params.senderid
  });
  res.status(200).json({ success: true, message: message });
});

/*$and: [
          { $or: [{a: 1}, {b: 1}] },
          { $or: [{c: 1}, {d: 1}] }
      ] */
router.get("/:senderid/:receiverid", async (req, res) => {
  senderid= req.params.senderid;
  receiverid= req.params.receiverid 
  const chat = await Message.find({
    $or: [{$and:[{ sender: senderid }, { receiver: receiverid }]},{$and:[{ sender: receiverid }, { receiver: senderid }]}]
  }).sort({ createdat: -1 });

  res.status(200).json({ success: true, chat: chat });
});
module.exports = router;
