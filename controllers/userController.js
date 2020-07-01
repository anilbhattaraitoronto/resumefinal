const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const { request } = require("express");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const getUserProfile = (req, res) => {
  if (req.session.user) {
    res.render("users/profile", {
      loggedin: req.session.loggedin,
      user: req.session.user,
      title: `Welcome ${req.session.user.username}`,
    });
  }
};

const createUser = (req, res) => {
  //get values from form
  let username = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirm_password;
  let getUserStmt = `SELECT username from users WHERE username=?;`;
  let addUserStmt = `INSERT INTO users (username, password) VALUES(?,?);`;
  if (password === confirmPassword) {
    let hashedPassword = bcrypt.hashSync(password, salt);
    const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.log("Error: ", err.message);
        res.redirect("/");
      } else {
        DB.get(getUserStmt, [username], (err, row) => {
          if (err) {
            console.log("Error: ", err.message);
            res.redirect("/");
          } else {
            if (row) {
              console.log("The username already exists. Please use a new one.");
              res.redirect("/");
            } else {
              DB.run(addUserStmt, [username, hashedPassword], (err) => {
                if (err) {
                  console.log("Error: ", err.message);
                  res.redirect("/");
                } else {
                  req.session.username = username;
                  req.session.loggedin = false;
                  req.session.success =
                    `Welcome ${username}. Thank you for registering.`,
                    DB.close((err) => {
                      if (err) {
                        console.log("Error: ", err.message);
                        return;
                      } else {
                        console.log("DB is closed. Thank you for registering");
                        res.redirect("/");
                      }
                    });
                }
              });
            }
          }
        });
      }
    });
  } else {
    console.log("Passwords do not match");
    res.redirect("/");
  }
};

//Log registered users in

const logUsersIn = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let getUserStmt = `SELECT * FROM users WHERE username=?;`;
    //open the database
    const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.log("Error: ", err.message);
        res.redirect("/");
      } else {
        DB.get(getUserStmt, [username], (err, row) => {
          if (row) {
            let hashedPassword = row.password;

            bcrypt.compare(password, hashedPassword, (err, result) => {
              if (err) {
                console.log("Error: ", err.message);
                res.redirect("/");
              } else {
                if (result === true) {
                  req.session.success = `You are now logged in ${row.username}`;
                  req.session.loggedin = true;
                  req.session.user = row;

                  DB.close((err) => {
                    if (err) {
                      console.log("Error: ", err.message);
                    } else {
                      console.log("DB is closed. Thank you for logging in. ");
                      res.redirect("/");
                    }
                  });
                } else {
                  console.log("Passwords do not match");
                  res.redirect("/");
                }
              }
            });
          } else {
            console.log("The username does not exist");
            res.redirect("/");
          }
        });
        //check if username exists
      }
    });
  } else {
    console.log("Both the fields are required. Please try again.");
    res.redirect("/");
  }
};

//log users out

const logUsersOut = (req, res) => {
  if (req.session.user) {
    req.session.destroy(() => {
      console.log("Successfully logged out");
    });
    res.redirect("/");
  }
};

module.exports = {
  getUserProfile,
  createUser,
  logUsersIn,
  logUsersOut,
};
