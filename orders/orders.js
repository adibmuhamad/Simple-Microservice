const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const axios = require("axios")

app.use(bodyParser.json())

//Connect database
mongoose.connect("YOUR MONGODB", () => {
    console.log("Databse is connected!");
});

//Load model
require("./Order")
const Order = mongoose.model("Order")

//Create func
app.post("/order", (res, req) => {
    var newOrder = {
        CustomerID: req.body.CustomerID,
        BookID: req.body.BookID,
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)
    order.save().then(() => {
        res.send("Order created with success!")
        console.log("New Order created!")
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
})

app.get("/orders", (req, res) => {
    Order.find().then((books) => {
        res.json(books)
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order){
            axios.get("http://localhost:5555/customer/" + order.CustomerID).then((response) => {
                var orderObject = {
                    customerName: response.data.name,
                    bookTitle: ''
                }

                axios.get("http://localhost:4545/book/" + order.BookID).then((response) => {
                    orderObject.bookTitle = response.data.title
                    res.json(orderObject)
                })
            })           
        }else{
            res.send("Invalid Order")
        }

    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.listen(7777, () => {
    console.log("Up and running - Order service")
})