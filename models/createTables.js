const sqlite = require("sqlite3");
const tables = require("./tables");

const DB = new sqlite.Database("./resumedb.sqlite", (err) => {
  if (err) {
    console.log("Error: ", err.message);
  } else {
    console.log("Db is now open");
    DB.exec("PRAGMA foreign_key=ON;", (err) => {
      if (err) {
        console.log("Error: ", err.message);
      } else {
        console.log("Foreign key is turned on ");
        DB.exec(tables, (err) => {
          if (err) {
            console.log("Error: ", err.message);
          } else {
            console.log("Tables are created");
            DB.close((err) => {
              if (err) {
                console.log("Error: ", err.message);
              } else {
                console.log("DB is closed. Bye!");
              }
            });
          }
        });
      }
    });
  }
});
