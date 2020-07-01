const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const sessionStore = require("connect-sqlite3")(session);
const createTables = require("./models/createTables");

//import routers below

const blogRouter = require("./routes/blogRouter");
const educationRouter = require("./routes/educationRouter");
const indexRouter = require("./routes/indexRouter");
const projectRouter = require("./routes/projectRouter");
const skillRouter = require("./routes/skillRouter");
const userRouter = require("./routes/userRouter");

//set items
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

app.use(session({
  store: new sessionStore(),
  secret: "*,mvDS^4j-Z4+-7&",
  resave: false,
  saveUninitialized: true,
}));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//use routers below
app.use("/", indexRouter);
app.use("/blogs", blogRouter);
app.use("/education", educationRouter);
app.use("/projects", projectRouter);
app.use("/skills", skillRouter);
app.use("/users", userRouter);

//create and run server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`App is running on ${PORT}`);
  }
});
