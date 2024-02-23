const { Router } = require("express");
const User = require("../models/user");

const router = Router();

//Routes handling.....
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  //To find email, password in reqest body and after mathch they is correct or not!
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    //Make or create cookie - name is token,
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  //To create a new User.......
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  //After singup the user to redirect the Home-Page.
  return res.redirect("/");
});

module.exports = router;
