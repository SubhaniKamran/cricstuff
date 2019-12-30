const express = require("express");
const router = express.Router();
const path = require("path");
const Post = require("../../models/Post");
const { protect } = require("../../middleware");
const uuidv1 = require("uuid/v1");
//@desc get all posts
//@route GET /api/v1/posts
//@acess Public
router.get("/getall", async (req, res) => {
  const post = await Post.find();

  res.status(200).json({ success: true, data: post });
});
//@desc get sinlge posts
//@route GET /api/v1/posts/:id
//@acess Public
router.get("/getbyId/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.status(200).json({ success: true, data: post });
});
//@desc create a post
//@route POST /api/v1/posts
//@acess Public
router.post("/add", protect, async (req, res) => {
  req.body.user = req.user.id;
  const post = await Post.create(req.body);

  res.status(201).json({ success: true, data: post });
});
//@desc update a posts
//@route PUT/api/v1/posts/:id
//@acess Public
router.put("/uploadImgs/:id", protect, async (req, res) => {
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

  file.name = `photo_${uuidv1()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Problem with file upload" });
    }
  });
  const post = await Post.findByIdAndUpdate(req.params.id, {
    $push: { image: file.name }
  });
  res.status(200).json({ success: true, data: post });
});

router.put("/edit/:id", protect, async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!post) {
    return res.status(404).json({ success: false });
  }

  res.status(200).json({ success: true, data: post });
});
//@desc delete a post
//@route DELETE /api/v1/posts
//@acess Public
router.delete("/delete/:id", protect, async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false });
  }

  res.status(200).json({ success: true, data: {} });
});

module.exports = router;
