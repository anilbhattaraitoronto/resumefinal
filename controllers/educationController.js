const sqlite3 = require("sqlite3");

const getAllEducation = (req, res) => {
  let getEducationStmt = `SELECT * FROM education;`;
  let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
    if (err) {
      console.error("Error: ", err.message);
    } else {
      DB.all(getEducationStmt, [], (err, items) => {
        if (err) {
          console.error("Error: ", err.message);
          res.redirect("/");
        } else {
          if (items.length === 0) {
            console.log("There is no education item yet");
            res.render(
              "education/index",
              {
                title: "Educational Qualifications",
                success: req.session.success,
                loggedin: req.session.loggedin,
                user: req.session.user,
                degrees: items,
                url: req.originalUrl,
              },
            );
          } else {
            res.render(
              "education/index",
              {
                title: "Educational Qualifications",
                success: req.session.success,
                loggedin: req.session.loggedin,
                user: req.session.user,
                degrees: items,
                url: req.originalUrl,
              },
            );
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
                return;
              } else {
                console.log(
                  "Closed DB after getting all educational qualification details",
                );
              }
            });
          }
        }
      });
    }
  });
};

const addNewEducation = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    //get form data
    let degree = req.body.degree;
    let school = req.body.school;
    let department = req.body.department;
    let thesis = req.body.thesis;
    let year_finished = req.body.year_finished;

    let addEducationStmt =
      `INSERT INTO education (degree, school, department, thesis, year_finished) VALUES(?,?,?,?,?);`;

    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error, ", err.message);
        res.redirect("/");
      } else {
        DB.run(
          addEducationStmt,
          [degree, school, department, thesis, year_finished],
          (err) => {
            if (err) {
              console.error("Error: ", err.message);
              res.redirect("/");
            } else {
              console.log("Education item is added");
              DB.close((err) => {
                if (err) {
                  console.error("Error: ", err.message);
                  res.redirect("/");
                } else {
                  console.log("DB is closed after adding education item.");
                  res.redirect("/education");
                }
              });
            }
          },
        );
      }
    });
  }
};
const updateEducation = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let degree = req.body.degree;
    let school = req.body.school;
    let department = req.body.department;
    let thesis = req.body.thesis;
    let yearFinished = req.body.year_finished;
    let educationId = req.body.educationid;

    let updateEducationStmt =
      `UPDATE education SET degree=?, school=?, department=?, thesis=?, year_finished=? WHERE educationid =?; `;
    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/education`);
      } else {
        DB.run(
          updateEducationStmt,
          [degree, school, department, thesis, yearFinished, educationId],
          (err) => {
            if (err) {
              console.error("Error: ", err.message);
              res.redirect(`/education`);
            } else {
              console.log("Education Item updated");
              DB.close((err) => {
                if (err) {
                  console.error("Error: ", err.message);
                  res.redirect(`/education`);
                } else {
                  console.log("Db is closed after updating!");
                  res.redirect(`/education`);
                }
              });
            }
          },
        );
      }
    });
  } else {
    console.log("Need to be admin staff to update education item");
  }
};

const deleteEducation = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let educationId = req.body.educationid;
    let deleteEducationStmt = `DELETE from education WHERE educationid=?;`;

    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/education`);
      } else {
        DB.run(deleteEducationStmt, educationId, (err) => {
          if (err) {
            console.error("Error: ", err.message);
            res.redirect(`/education`);
          } else {
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
                res.redirect("/education");
              } else {
                console.log("That post is deleted and DB closed");
                res.redirect(`/education`);
              }
            });
          }
        });
      }
    });
  } else {
    console.log("Need to be admin staff to delete education item");
  }
};

module.exports = {
  getAllEducation,
  addNewEducation,
  updateEducation,
  deleteEducation,
};
