const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
var expressLayouts = require('express-ejs-layouts');

// routes imports
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authentication");

// middlewares imports
const isLogged = require("./middlewares/isLogged");

// init express app
const app = express();
app.use(cors());
// session
const session = require("express-session");

// session options
const oneDay = 1000 * 60 * 60 * 24;
sess = session({
  secret: process.env.SECRET_KEY,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
});

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(sess);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// http logger
if (process.env.MORGAN === "true") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// parsers: parsing the incoming data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static folders
app.use(express.static(path.join(__dirname, "public")));

// routers
app.use("/", authRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
