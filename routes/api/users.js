const path = require("path");
const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { firstname, lastname, phone, password, password2 } = req.body;
  if (password != password2) {
    return res
      .status(400)
      .json({ success: false, msg: "your passwords not matched" });
  }

  try {
    const user = await User.create({
      firstname,
      lastname,
      phone,
      password
    });

    const token = user.getSignedToken();
    res.status(200).json({ success: true, token: token, data: user });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
});

router.put("/upload/:id", async (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ success: false, message: "Please attach a file" });
  }

  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return res
      .status(400)
      .json({ success: false, message: "Please attach an image" });
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload a valid image" });
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Problem with file upload" });
    }
  });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { photo: file.name },
    {
      new: true
    }
  );
  res.status(200).json({ success: true, data: user });
});

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter email or password" });
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = user.getSignedToken();
  res.status(200).json({ success: true, token: token, id: user.id });
});

module.exports = router;
