const express = require("express");
const MONGODB_URI =
  "mongodb+srv://helmy:jXef9jwRbG66GQ9Y@cluster0.ogtsr.mongodb.net/shop";
const app = express();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const path = require("path");
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");

var bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");
var MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  "./images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(cors());
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// parse application/json
app.use(bodyParser.json());
const csrfProtection = csrf();
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
}),
  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// app.get("/500", errorController.get500);
// app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   console.log(req);
//   res.status(500).render("500", {
//     pageTitle: "Error",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedIn,
//   });
// });

mongoose
  .connect(`${MONGODB_URI}?retryWrites=true&w=majority`)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const data = new User({
          name: "Admin",
          email: "h@h.com",
          password: "123456",
          cart: { items: [] },
        });
        data.save().then((result) => {
          req.user = result;
        });
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
