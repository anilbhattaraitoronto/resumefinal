const sqlite3 = require("sqlite3");

const getAllBlogs = (req, res) => {
  //get blogs from db
  let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
    if (err) {
      console.error("Error: ", err.message);
    } else {
      let getBlogsStmt = `SELECT * from blogs LIMIT 10;`;
      DB.all(getBlogsStmt, [], (err, blogs) => {
        if (err) {
          console.error("Error: ", err.message);
        } else {
          if (blogs.length === 0) {
            console.log("There are no blogs yet");
            res.render("blogs/index", {
              title: "All Blogs",
              blogs: blogs,
              success: req.session.success,
              loggedin: req.session.loggedin,
              user: req.session.user,
              url: req.originalUrl,
            });
          } else {
            res.render("blogs/index", {
              title: "All Blogs",
              blogs: blogs,
              success: req.session.success,
              loggedin: req.session.loggedin,
              user: req.session.user,
              url: req.originalUrl,
            });
            DB.close((err) => {
              if (err) {
                console.log("Error: ", err.message);
              } else {
                console.log("Got all blogs. Db is closed now");
              }
            });
          }
        }
      });
    }
  });
};

const createNewBlog = (req, res) => {
  if (req.session.user.is_admin === 1) {
    //get data from form submission
    let title = req.body.title;
    let keywords = req.body.keywords;
    let summary = req.body.summary;
    let author = req.body.author;
    let content = req.body.content;

    let addBlogStmt =
      `INSERT INTO blogs (title, keywords, summary, author, content) VALUES (?, ?,?,?,?);`;

    const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.log("Error: ", err.message);
        res.redirect("/blogs");
      } else {
        DB.run(
          addBlogStmt,
          [title, keywords, summary, author, content],
          (err) => {
            if (err) {
              console.log("Error: ", err.message);
              res.redirect("/blogs");
            } else {
              console.log("New Blog added");
              DB.close((err) => {
                if (err) {
                  console.log("Error: ", err.message);
                } else {
                  console.log("Db Closed after creating new blog.");
                  res.redirect("/blogs");
                }
              });
            }
          },
        );
      }
    });
  } else {
    console.log("Have to be admin to create new blog.");
  }
};

//Get single blog

const getBlogDetail = (req, res) => {
  let blogId = req.params.blogid;
  let getBlogStmt = `SELECT * FROM blogs WHERE blogid = ?;`;
  let getCommentsStmt = `SELECT * from comments WHERE blog=?;`;
  const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
    if (err) {
      console.error("Error: ", err.message);
    } else {
      DB.get(getBlogStmt, [blogId], (err, blog) => {
        if (err) {
          console.log("Error: ", err.message);
        } else {
          if (blog) {
            DB.all(getCommentsStmt, [blogId], (err, comments) => {
              if (err) {
                console.error("Error: ", err.message);
                res.redirect(`/blogs/detail/${blogId}`);
              } else {
                if (comments.length === 0) {
                  console.log("There is no comment yet");
                  res.render("blogs/detail", {
                    blog: blog,
                    comments: comments,
                    title: blog.title,
                    user: req.session.user,
                    loggedin: req.session.loggedin,
                    success: req.session.success,
                  });
                } else {
                  res.render("blogs/detail", {
                    blog: blog,
                    comments: comments,
                    title: blog.title,
                    user: req.session.user,
                    loggedin: req.session.loggedin,
                    success: req.session.success,
                  });
                  DB.close((err) => {
                    if (err) {
                      console.error("Error: ", err.message);
                      res.redirect(`/blogs/detail/${blogId}`);
                    } else {
                      console.log(
                        "DB is closed after getting comments and the blog",
                      );
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  });
};

const updateBlog = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let title = req.body.title;
    let keywords = req.body.keywords;
    let summary = req.body.summary;
    let author = req.body.author;
    let content = req.body.content;
    let blogId = req.body.blogid;

    let updateBlogStmt =
      `UPDATE blogs SET title=?, keywords=?, summary=?, author=?, content=? WHERE blogid =?; `;
    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/blogs`);
      } else {
        DB.run(
          updateBlogStmt,
          [title, keywords, summary, author, content, blogId],
          (err) => {
            if (err) {
              console.error("Error: ", err.message);
              res.redirect(`/blogs`);
            } else {
              console.log("Blog updated");
              DB.close((err) => {
                if (err) {
                  console.error("Error: ", err.message);
                  res.redirect(`/blogs`);
                } else {
                  console.log("Db is closed after updating!");
                  res.redirect(`/blogs`);
                }
              });
            }
          },
        );
      }
    });
  } else {
    console.log("Need to be admin staff to add comment");
  }
};

const deleteBlog = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let blogId = req.body.blogid;
    let deleteBlogStmt = `DELETE from blogs WHERE blogid=?;`;

    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/blogs`);
      } else {
        DB.run(deleteBlogStmt, blogId, (err) => {
          if (err) {
            console.error("Error: ", err.message);
            res.redirect(`/blogs`);
          } else {
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
              } else {
                console.log("That post is deleted and DB closed");
                res.redirect(`/blogs`);
              }
            });
          }
        });
      }
    });
  } else {
    console.log("Need to be admin staff to delete blog");
  }
};
const addComment = (req, res) => {
  if (req.session.user && req.session.loggedin) {
    let commenter = req.session.user.username;
    let blogId = req.body.blogid;
    let comment = req.body.comment;

    let addCommentStmt =
      `INSERT INTO comments (commenter, blog, comment) VALUES(?,?,?);`;
    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/blogs/detail/${blogId}`);
      } else {
        DB.run(addCommentStmt, [commenter, blogId, comment], (err) => {
          if (err) {
            console.error("Error: ", err.message);
            res.redirect(`/blogs/detail/${blogId}`);
          } else {
            console.log(`Comments added by ${commenter}. Thank you`);
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
                res.redirect(`/blogs/detail/${blogId}`);
              } else {
                console.log("DB is closed now after adding comment");
                res.redirect(`/blogs/detail/${blogId}`);
              }
            });
          }
        });
      }
    });
  }
};

module.exports = {
  getAllBlogs,
  createNewBlog,
  getBlogDetail,
  updateBlog,
  deleteBlog,
  addComment,
};
