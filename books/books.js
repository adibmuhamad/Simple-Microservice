const express = require("express");
const app = express();
const mongoose = require("mongoose")
const bodyparse = require("body-parser");

app.use(bodyparse.json());

//Connect database
mongoose.connect("YOUR MONGODB", () => {
    console.log("Databse is connected!");
});

//Load model
require("./Book")
const Book = mongoose.model("Book");

//Create func
app.post("/book", (req,res) => {
    var newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    }

    var book = new Book(newBook)
    
    book.save().then(() => {
        console.log("New book created!")
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
    res.send("A new book created with success")
})

app.get("/books", (req, res) => {
    Book.find().then((books) => {
        res.json(books)
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.get("/book/:id", (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if(book){
            res.json(book)
        }else{
            res.sendStatus(404);
        }

    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.delete("/book/:id", (req, res) => {
    Book.findOneAndRemove(req.params.id).then(() => {
        res.send("Book removed with success")
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.listen(4545, () => {
    console.log("Up and running! -- This is our Books Service");
})