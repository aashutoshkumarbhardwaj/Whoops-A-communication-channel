const express = require('express');

const userRoutes = require("./routes/user");
const mongoose = require('mongoose');

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

app.use((req, res, next) => {
    res.locals.user = null;
    res.locals.flash = [];
    next();
});

app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
        user: null   // or req.user later when auth exists
    });
});

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});