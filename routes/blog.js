const {Router} = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
    res.render("addBlog", {
        user: req.user,
        title: "Add New Blog"
    });
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("author");
    const comments = await Comment.find({ blogId: req.params.id }).populate("author").sort({ createdAt: -1 });

    if (!blog) {
        return res.status(404).render("404", {
            user: req.user,
            title: "Blog Not Found"
        });
    }
    return res.render("blogDetails", {
        user: req.user,
        title: blog.title,
        blog,
        comments,
    });
});

router.post("/comment/:blogId", async (req, res) => {

     await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        author:req.user._id
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});



router.post("/add-new", upload.single("coverImage"), async (req, res) => {
    const { title, content } = req.body;
    const blog = await Blog.create({
        title,
        content,
        author: req.user._id,
        coverImage: `/uploads/${req.file.filename}`
    });
    return res.redirect(`/`);
});

module.exports = router;