const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/", blogController.getAllBlogs);
router.post("/create", blogController.createNewBlog);
router.get("/detail/:blogid", blogController.getBlogDetail);
router.post("/comments", blogController.addComment);

module.exports = router;
