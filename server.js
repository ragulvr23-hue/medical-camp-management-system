require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();
const required = ["MONGODB_URI", "SESSION_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => { console.error("MongoDB connection failed:", err.message); process.exit(1); });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: "sessions" }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: (Number(process.env.SESSION_MAX_AGE_DAYS) || 1) * 86400000
  }
}));
app.use(flash());
app.use(csrf());
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.csrfToken = req.csrfToken();
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

app.use((req, res) => res.status(404).render("error", { title: "Page not found", message: "The page you requested could not be found." }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "EBADCSRFTOKEN") {
    req.flash("error", "Your form session expired. Please try again.");
    return res.redirect("back");
  }
  res.status(err.status || 500).render("error", {
    title: "Something went wrong",
    message: process.env.NODE_ENV === "production" ? "An unexpected error occurred." : err.message
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Medical Camp Management running at http://localhost:${port}`));
