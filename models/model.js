const mongoose = require('mongoose');

const Rides = mongoose.Schema({
    start: String,
    end: String,
    rrating: { type: Number, default: null },
    urating: { type: Number, default: null },
    rider:String,
    user : String
});

const Rider = mongoose.Schema({
    name: String,
    mobile: Number,
    password:String
});

const User = mongoose.Schema({
    name: String,
    mobile: Number,
    password:String
});


module.exports= {
    Rides:mongoose.model('Rides', Rides),
    Rider:mongoose.model('Rider', Rider),
    User:mongoose.model('User',User)
};