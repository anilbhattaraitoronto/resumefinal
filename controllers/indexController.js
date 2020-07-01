const sqlite3 = require("sqlite3");

const getHomePage = (req, res) => {
  //Get 10 latest blogs

  const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
    if (err) {
      console.error("Error: ", err.message);
      return;
    } else {
      let getBlogStmt =
        `SELECT * FROM blogs ORDER BY posted_date DESC LIMIT 10;`;
      DB.all(getBlogStmt, [], (err, blogs) => {
        if (err) {
          console.error("Error: ", err.message);
        } else {
          res.render(
            "index",
            {
              blogs: blogs,
              title: "Welcome",
              success: req.session.success,
              loggedin: req.session.loggedin,
              user: req.session.user,
            },
          );
          DB.close((err) => {
            if (err) {
              console.error("Error: ", err.message);
              return;
            } else {
              console.log("DB closed after getting 10 new blogs");
            }
          });
        }
      });
    }
  });
};

module.exports = { getHomePage };
