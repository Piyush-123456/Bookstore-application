const mongoose = require("mongoose");

const createmodel = new mongoose.Schema({
    name: String,
    posterurl: String,
    authorname: String,
    price: Number,
    description: String,
    isbn: Number
})

const collection = mongoose.model("books", createmodel);
module.exports = collection;