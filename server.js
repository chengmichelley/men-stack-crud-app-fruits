require('dotenv').config()
const express = require('express')
const app = express()
const Fruit = require('./models/fruit')

// Middlewares
// Load in our mongodb connection
require('./db/connection')

 

// Routes
// Landing
app.get('/', (req, res) => {
    res.render("index.ejs")
})

// I.N.D.U.C.E.S (RESTful Routes)

// New - GET /fruits/new - send a form to create a new fruit
// Create - Post /fruits - take data from the fruits/new form and add to the data

// Index - GET /fruits - get all all the fruits and send back a page
// New - GET /fruits/new - send a form to create a new fruit
// Delete- Delete /fruits/:fruitId - delete some fruits based on param passed
// Update- PUT /fruits/:fruitId - update some fruits based on the param passed and req.body
// Create - POST /fruits - take data from the fruits/new form and add to the data
// Edit - GET /fruits/:fruitId/edit - edit a specific fruit
// Show = GET /fruits/:fruitId - show one specific fruit


app.listen(3000, ()=> console.log("We are gonna CRUD those Fruits on 3000"))