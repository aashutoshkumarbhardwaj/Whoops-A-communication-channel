const express = require('express');
const path = require('path');
const userRoutes = require("./routes/user");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const checkforAuthentication = require('./middleware/authentication');


const blogRoutes = require("./routes/blog");
const Blog = require("./models/blog");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydb");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
}

connectDB();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.set("views", "./views");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkforAuthentication("token"));

app.use((req, res, next) => {
    res.locals.user = null;
    res.locals.flash = [];
    next();
});

app.use(express.static("public"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 });

    console.log("Blogs fetched:", allBlogs.length);
    res.render("home", {
       user: req.user, // Pass user info to the template
       title: "Home Page",
       blogs: allBlogs
    });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});