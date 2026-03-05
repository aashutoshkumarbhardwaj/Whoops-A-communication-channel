const {Router} = require('express');
const User = require("../models/User");
const { createTokenForUser } = require('../services/authentication');
const router = Router();

router.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Sign In",
        user: req.user
    });
});

router.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Sign Up",
        user: req.user
    });
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already registered");
    }

    await User.create({ name, email, password });

    return res.redirect("/signin");

  } catch (err) {
    console.error(err);
    res.send("Something went wrong");
  }
});


router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.matchPassword(email, password);
        const token = createTokenForUser(user);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            title: "Sign In",
            user: req.user,
            error: "Invalid email or password"
        });
    }
});

router.get("/signout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

module.exports = router;