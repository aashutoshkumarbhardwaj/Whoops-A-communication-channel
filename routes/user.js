const {Router} = require('express');
const User = require("../models/User");
const router = Router();

router.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Sign In",
        user: null   // or req.user later when auth exists
    });
});

router.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Sign Up",
        user: null   // or req.user later when auth exists
    });
});

router.post("/signin", (req, res) => {
    // Handle sign in logic here
    res.send("Sign In POST route");
    res.redirect("/");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already registered");
    }

    await User.create({ username, email, password });

    res.send("User created successfully");

  } catch (err) {
    console.error(err);
    res.send("Something went wrong");
  }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const isMatch = await User.matchPassword(email, password);
    if (!isMatch) {
        return res.send("Invalid email or password");
    }

    res.send("Sign in successful");
});

module.exports = router;module.exports = router;