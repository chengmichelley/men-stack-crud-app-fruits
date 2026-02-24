require("dotenv").config();
const express = require("express");
const app = express();
const Fruit = require("./models/fruits");
const fruit = require("./models/fruits");
const morgan = require("morgan")

// Middlewares
// Load in our mongodb connection
require("./db/connection");
// add in the ability to accept form data from a incoming request
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));    
app.use(morgan("tiny"))
// Opt in to using public or static files
app.use(express.static('public'))
// Routes
// Landing
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// I.N.D.U.C.E.S (RESTful Routes)

// ** Index - GET /fruits - get all all the fruits and send back a page
// ** New - GET /fruits/new - send a form to create a new fruit
// ** Delete - Delete /fruits/:fruitId - delete some fruits based on the param passed
// Update - Put /fruits/:fruitId  - update some fruits baseed on the apram passed and req.body
// ** Create - Post /fruits - take data from the fruits/new form and add to the data
// ** Edit - GET /fruits/:fruitId/edit - edit a specific fruit
// ** Show - GET /fruits/:fruitId - show one specific fruit

// Extra Routes 
// GET /fruits/:fruitId/confirm_delete -> Show a confirmation for deleting an otem
// 

// Index - GET /fruits - get all all the fruits and send back a page

// Index - GET /fruits - get all all the fruits and send back a page
app.get("/fruits", async (req, res) => {
  try {
    // Find fruits where isSoftDeleted is either false OR null
    const fruits = await Fruit.find({ 
      isSoftDeleted: { $in: [false, null] } 
    });

    res.render("fruits/index.ejs", { fruits });
  } catch (error) {
    res.json({ err: error.message });
  }
});

// New - GET /fruits/new - send a form to create a new fruit
app.get("/fruits/new", (req, res) => {
  // send back a form to create a new fruit
  res.render("fruits/new.ejs", { message: "" });
});

// Delete - Delete /fruits/:fruitId - delete some fruits based on the param passed
app.delete('/fruits/:fruitId', async (req, res) => {
  try {
    // delete a fruit
    await Fruit.findByIdAndDelete(req.params.fruitId)
    // Send the user to the all fruits page
    res.redirect('/fruits')
  } catch (error) {
    res.render("error.ejs", { message: error.message });
  }
})

//Update

app.put('/fruits/:fruitId', async (req, res) => {
  try {
    // Handle input checkbox's 'on' status
    req.body.isReadyToEat = req.body.isReadyToEat === "on"

    // update a fruit
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
    // Send the user to the fruits show page
    res.redirect(`/fruits/${req.params.fruitId}`)

  } catch (error) {
    res.render("error.ejs", { message: error.message });
  }
})

// Soft Delete - Delete /fruits/:fruitId - delete some fruits based on the param passed
// TLDR; Hide from the UI but still show in the db 
app.delete('/fruits/:fruitId/soft', async (req, res) => {
  try {
    // Soft delete a fruit
    await Fruit.findByIdAndUpdate(req.params.fruitId, { isSoftDeleted: true })
    // Send the user to the all fruits page
    res.redirect('/fruits')

  } catch (error) {
    res.render("error.ejs", { message: error.message });
  }
})

// Create - Post /fruits - take data from the fruits/new form and add to the data
app.post("/fruits", async (req, res) => {
  try {
    // check for a empty name or color
    const { name, color, description } = req.body;
    // if I trim the name || color and they are falsey aka "" throw an error
    if (!name.trim()) {
      return res.render("/fruits/new", {
        message: "Name must have a valid field",
      });
    }

    if (description && description.length > 100) {
      return res.render("/fruits/new", {
        message: "Please use less that 100 chars for your description",
      });
    }

    // Handle input checkbox's 'on' status
    req.body.isReadyToEat = req.body.isReadyToEat === "on" ? true : false;
    // Give the form data to the model.create to make a new mongo object
    await Fruit.create(req.body);
    // redirect to the fruits index page
    res.redirect("/fruits");
  } catch (error) {
    res.render("error.ejs", { message: error.message });
  }
});

// GET /fruits/:fruitId/confirm_delete- show one specific fruit
app.get("/fruits/:fruitId/confirm_delete", async (req, res) => {
  try {
    // Find a Fruit using the id from the url params
    const foundFruit = await Fruit.findById(req.params.fruitId);
    // Send a error of no fruit found, if we don't find a fruit with that id
    // throwing a manual error will stop this fuinction go straight to the catch
    // and passes this error as error.message
    if (!foundFruit)
      throw new Error(
        "Failed to find that fruit, please click back and try again",
      );
    // send back the found fruit ( eventually the show page)

    res.render("fruits/fruit_delete_confirm_cancel.ejs", {
      fruit: foundFruit,
    });
  } catch (error) {
    res.json({ err: error.message });
  }
});

// Edit - GET /fruits/:fruitId/edit - edit a specific fruit
app.get("/fruits/:fruitId/edit", async (req, res) => {
  try {
    // Find a Fruit using the id from the url params
    const foundFruit = await Fruit.findById(req.params.fruitId);
    // Send a error of no fruit found, if we don't find a fruit with that id
    // throwing a manual error will stop this fuinction go straight to the catch
    // and passes this error as error.message
    if (!foundFruit)
      throw new Error(
        "Failed to find that fruit, please click back and try again",
      );
    // send back the found fruit ( eventually the show page)

    res.render("fruits/show.ejs", {
      fruit: foundFruit,
    });
  } catch (error) {
    res.json({ err: error.message });
  }
});

// Show - GET /fruits/:fruitId - show one specific fruit
app.get("/fruits/:fruitId", async (req, res) => {
  try {
    // Find a Fruit using the id from the url params
    const fruit = await Fruit.findById(req.params.fruitId);
    // Send a error of no fruit found, if we don't find a fruit with that id
    // throwing a manual error will stop this function go straight to the catch
    // and passes this error as error.message
    if (!fruit)
      throw new Error(
        "Failed to find that fruit, please click back and try again",
      );
    // send back the found fruit ( eventually the show page)

    res.render("fruits/show.ejs", {
      fruit: fruit,
      isReadyToEatMessage: fruit.isReadyToEat
        ? "This fruit is ready to eat!"
        : "This fruit is not ready to eat!",
    });
  } catch (error) {
    res.json({ err: error.message });
  }
});

app.listen(3000, () => console.log("We are gonna CRUD those Fruits on 3000"));
