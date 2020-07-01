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

module.exports = {
  getAllEducation,
  addNewEducation,
};
