const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

app.use(bodyparse.json());

//Connect database
mongoose.connect("YOUR MONGODB", () => {
    console.log("Databse is connected!");
});

//Load model
require("./Customer")
const Customer = mongoose.model("Customer");

//Create func
app.post("/customer", (req, res) => {
    var newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    }

    var customer = new Customer(newCustomer)
    customer.save().then(() => {
        console.log("New Customer created!")
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
    res.send("A new Customer created with success")
})

app.get("/customers", (req, res) => {
    Customer.find().then((customers) => {
        res.json(customers)
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.get("/customer/:id", (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer){
            res.json(customer)
        }else{
            res.sendStatus(404);
        }

    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.delete("/customer/:id", (req, res) => {
    Customer.findOneAndRemove(req.params.id).then(() => {
        res.send("Customer removed with success")
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.listen(5555, () => {
    console.log("Up and running - Customer service")
})