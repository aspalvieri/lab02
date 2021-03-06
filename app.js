require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, {
    auth: {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    useNewUrlParser: true
}).catch(err => console.log(`ERROR: ${err}`));

const express = require("express");
const app = express();

//Adding cookies and sessions support
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(cookieParser());
app.use(session({
    secret: (process.env.secret || "random-salt-word-abc"),
    cookie: {
        max: 10800000
    },
    resave: true,
    saveUninitialized: true
}));
//Enabling flash cards
app.use(flash());
app.use((req, res, next) => {
    res.locals.flash = res.locals.flash || {};
    res.locals.flash.success = req.flash("success") || null;
    res.locals.flash.error = req.flash("error") || null;
    next();
});

//Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//View paths
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use("/css", express.static("assets/stylesheets"));

//Routes and paths
const routes = require("./routes.js");
app.use("/", routes);

const port = (process.env.PORT || 4000);
app.listen(port, () => console.log(`Listening on ${port}`));