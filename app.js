require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const { logGenerate  } = require("./middlewares/logGen")

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

//Connect DB
mongoose
  .connect(url)
  .then((e) => console.log("MongoDB Connected"));

//Engine use define... which engine is used to views-page.
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
app.set("views", path.resolve("./views"));

//middleware....
//this middleware to encode the form data.
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(logGenerate("log.txt"));
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
