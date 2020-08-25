// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 3000;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieSession({
  name: 'user_id',
  keys: ['key1']
}));

app.set("view engine", "ejs");
app.use(express.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));



// Separated Routes for each Resource
const toHomePage = require("./routes/home");
const renderHomePage =require("./routes/homeRender");
const createRoutes = require("./routes/createstory");
const updateRoutes = require("./routes/updatestory");


// home pages
app.use("/", renderHomePage(db));
app.use("/stories", toHomePage(db));
// create and update story
app.use("/new", createRoutes(db));
app.use("/update", updateRoutes(db));




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;