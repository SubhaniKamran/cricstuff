const jwt = require("jsonwebtoken");
const User = require("./models/User");
exports.sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedToken();
  const options = {
    expires: new Date(Date.now + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } /*else if (req.cookie.token) {
    token = req.cookie.token;
  }*/
  if (!token) {
    return res.status(401).json({ success: false, Msg: "You shoud be login" });
  }
  try {
    const decode = jwt.verify(token, "4564564212");
    console.log(decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};
