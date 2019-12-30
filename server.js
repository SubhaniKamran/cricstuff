const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const users = require("./routes/api/users");
const post = require("./routes/api/post");
const message = require("./routes/api/message");
const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
// DB Config

const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.use(fileupload());
app.use(express.static(path.join(__dirname, "public")));
// Routes
app.use("/api/users", users);
app.use("/api/chat", message);
app.use("/api/post", post);
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
