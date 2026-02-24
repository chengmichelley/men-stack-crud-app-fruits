require("dotenv").config();
const express = require("express");
const app = express();
const methodOverride = require('method-override');
const Fruit = require("./models/fruits");
const fruit = require("./models/fruits");
var fs = require('fs')
const path = require('path')
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
const fruitsController = require('./controllers/fruits.controller.js')

// Handles Logging of incoming request
const morgan = require('morgan')

// Middlewares
// Load in our mongodb connection
require("./db/connection");
// add in the ability to accept form data from a incoming request
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(morgan('tiny', { stream: accessLogStream }))
// Opt in to using public or static files
app.use(express.static('public'))

// Routes
// Landing
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// attach router / fruit controller to the with app.use(router)
app.use(fruitsController)
// ex extra routes
// app.use(userController)
// app.use(petsController)
// app.use(treatsController)
// app.use(addoptionController)


app.get('/*slug', (req, res) => {
  res.render('error.ejs', { message: 'The url you requested does not exist' })
})

app.listen(3000, () => console.log("We are gonna CRUD those Fruits on 3000"));
