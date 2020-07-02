const sqlite3 = require("sqlite3");

const getAllSkills = (req, res) => {
  let getSkillStmt = `SELECT * FROM skills;`;
  let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
    if (err) {
      console.error("Error: ", err.message);
      return;
    } else {
      DB.all(getSkillStmt, [], (err, skills) => {
        if (err) {
          console.error("Error: ", err.message);
          return;
        } else {
          res.render(
            "skills/index",
            {
              skills: skills,
              title: "All Skills",
              success: req.session.success,
              loggedin: req.session.loggedin,
              user: req.session.user,
              url: req.originalUrl,
            },
          );
          DB.close((err) => {
            if (err) {
              console.error("Error: ", err.message);
              return;
            } else {
              console.log("DB closed after retrieving skill items");
            }
          });
        }
      });
    }
  });
};

const createNewSkill = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let title = req.body.title;
    let description = req.body.description;
    let addSkillStmt = `INSERT INTO skills (title, description) VALUES(?,?);`;
    const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect("/skills");
        return;
      } else {
        DB.run(addSkillStmt, [title, description], (err) => {
          if (err) {
            console.error("Error: ", err.message);
            res.redirect("/skills");
          } else {
            console.log("Added new skill");
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
                res.redirect("/skills");
              } else {
                console.log("DB closed after adding skills");
                res.redirect("/skills");
              }
            });
          }
        });
      }
    });
  } else {
    console.log("You need to be admin to add skills");
  }
};

const updateSkill = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let title = req.body.title;
    let description = req.body.description;
    let skillId = req.body.skillid;

    let updateSkillStmt =
      `UPDATE skills SET title=?, description=? WHERE skillid =?; `;
    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/skills`);
      } else {
        DB.run(
          updateSkillStmt,
          [title, description, skillId],
          (err) => {
            if (err) {
              console.error("Error: ", err.message);
              res.redirect(`/skills`);
            } else {
              console.log("Skill Item updated");
              DB.close((err) => {
                if (err) {
                  console.error("Error: ", err.message);
                  res.redirect(`/skills`);
                } else {
                  console.log("Db is closed after updating skill!");
                  res.redirect(`/skills`);
                }
              });
            }
          },
        );
      }
    });
  } else {
    console.log("Need to be admin staff to update skill");
  }
};

const deleteSkill = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let skillId = req.body.skillid;
    let deleteSkillStmt = `DELETE from skills WHERE skillid=?;`;

    let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect(`/skills`);
      } else {
        DB.run(deleteSkillStmt, skillId, (err) => {
          if (err) {
            console.error("Error: ", err.message);
            res.redirect(`/skills`);
          } else {
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
                res.redirect("/skills");
              } else {
                console.log("That skill is deleted and DB closed");
                res.redirect(`/skills`);
              }
            });
          }
        });
      }
    });
  } else {
    console.log("Need to be admin staff to delete skill item");
  }
};

module.exports = {
  getAllSkills,
  createNewSkill,
  updateSkill,
  deleteSkill,
};
