//bring in mongoose
const mongoose = require("mongoose")

//set up the model schema
const fruitSchema = new mongoose.Schema({
    //this takes key value pairs for fields on this collection
    name: String,
    isReadyToEat: Boolean,
    color: String,
    //timestamps true option adds createdAt and updatedAt to the record
}, {timestamps:true})

//make a model and export it
module.exports= mongoose.Model("Fruits", fruitSchema)