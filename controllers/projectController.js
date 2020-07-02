const sqlite3 = require("sqlite3");

const getAllProjects = (req, res) => {
  let getProjectStmt = `SELECT * FROM projects;`;
  let DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
    if (err) {
      console.error("Error: ", err.message);
      return;
    } else {
      DB.all(getProjectStmt, [], (err, projects) => {
        if (err) {
          console.error("Error: ", err.message);
          return;
        } else {
          //render the projects page
          if (projects.length === 0) {
            console.log("There is no project yet");
            res.render(
              "projects/index",
              {
                projects: projects,
                title: "All Projects",
                success: req.session.success,
                loggedin: req.session.loggedin,
                user: req.session.user,
                url: req.originalUrl,
              },
            );
          } else {
            res.render(
              "projects/index",
              {
                projects: projects,
                title: "All Projects",
                success: req.session.success,
                loggedin: req.session.loggedin,
                user: req.session.user,
                url: req.originalUrl,
              },
            );
          }
        }
      });
    }
  });
};

const createNewProject = (req, res) => {
  if (req.session.user && req.session.user.is_admin === 1) {
    let title = req.body.title;
    let description = req.body.description;
    let addProjectStmt =
      `INSERT INTO projects (title, description) VALUES(?,?);`;
    const DB = new sqlite3.Database("./resumedb.sqlite", (err) => {
      if (err) {
        console.error("Error: ", err.message);
        res.redirect("/projects");
        return;
      } else {
        DB.run(addProjectStmt, [title, description], (err) => {
          if (err) {
            console.error("Error: ", err.message);
            res.redirect("/projects");
          } else {
            console.log("Added new projects");
            DB.close((err) => {
              if (err) {
                console.error("Error: ", err.message);
                res.redirect("/projects");
              } else {
                console.log("DB closed after adding projects");
                res.redirect("/projects");
              }
            });
          }
        });
      }
    });
  } else {
    console.log("You need to be admin to create projects");
  }
};
module.exports = {
  getAllProjects,
  createNewProject,
};
