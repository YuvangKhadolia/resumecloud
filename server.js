// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");

// const { connectDB } = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const resumeRoutes = require("./routes/resumeRoutes");

// const app = express();

// /* ===================== CONNECT DATABASE ===================== */
// connectDB();

// /* ===================== MIDDLEWARE ===================== */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "public")));

// /* ===================== SESSION ===================== */
// app.use(
//   session({
//     name: "resumecloud.sid",
//     secret: "resumecloud_super_secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 2 // 2 hours
//     }
//   })
// );

// /* ===================== MAKE USER GLOBAL ===================== */
// app.use((req, res, next) => {
//   res.locals.user = req.session.user || null;
//   next();
// });

// /* ===================== VIEW ENGINE ===================== */
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// /* ===================== ROUTES ===================== */
// app.use("/", authRoutes);
// app.use("/", resumeRoutes);

// /* ===================== HOME ===================== */
// app.get("/", (req, res) => {
//   if (!req.session.user) {
//     return res.render("home");
//   }
//   res.redirect("/dashboard");
// });

// /* ===================== 404 ===================== */
// app.use((req, res) => {
//   res.status(404).render("404");
// });



// /* ===================== SERVER ===================== */
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 ResumeCloud running on http://localhost:${PORT}`);
// });



require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

/* ===================== CONNECT DATABASE ===================== */

connectDB();

/* ===================== MIDDLEWARE ===================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

/* ===================== SESSION ===================== */

app.use(
    session({
        name: "resumecloud.sid",

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);

/* ===================== MAKE USER GLOBAL ===================== */

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

/* ===================== VIEW ENGINE ===================== */

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

/* ===================== ROUTES ===================== */

app.use("/", authRoutes);

app.use("/", resumeRoutes);

/* ===================== HOME ===================== */

app.get("/", (req, res) => {

    if (!req.session.user) {
        return res.render("home");
    }

    res.redirect("/dashboard");
});

/* ===================== 404 ===================== */

app.use((req, res) => {
    res.status(404).render("404");
});

/* ===================== SERVER ===================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `🚀 ResumeCloud running on http://localhost:${PORT}`
    );
});