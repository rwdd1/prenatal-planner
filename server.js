const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const connectDB = require("./config/database");
const cors = require('cors');

const addRoute = require("./routes/add");
const authRoute = require("./routes/auth");
const errorRoute = require("./routes/error");
const findRoute = require("./routes/find");
const homeRoute = require("./routes/home");
const indexRoute = require("./routes/index");
const profileRoute = require("./routes/profile");

//dotenv config
require("dotenv").config({ path: "./config/.env" });

//passport config
require("./config/passport")(passport);

//connect to mdb
connectDB();

//ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

//body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//method override
app.use(methodOverride("_method"));

//cors
app.use(cors());

//sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: false,
        rolling: true,
        cookie: { maxAge: 60 * 10 * 1000 }, // timeout after 10 mins
        //cookie: { secure: true }
        store: MongoStore.create({ 
            mongoUrl: process.env.CONN_STR,
            mongooseConnection: mongoose.connection
        })
    })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/add", addRoute);
app.use("/find", findRoute);
app.use("/home", homeRoute);
app.use("/profile", profileRoute);
app.use("*", errorRoute);

app.listen(process.env.PORT, () => console.log("Server running"));