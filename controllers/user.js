const {User,Rides,Rider} = require('../models/model.js');
const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');
const validatetoken = auth.validatetoken;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtconfig = require('../config/jwtkey.config');
const jwtKey = jwtconfig.jwtKey
const jwtExpirySeconds = jwtconfig.jwtExpirySeconds;

// Create and Save a new User
exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ "mobile": req.body.mobile });
        if (user == null) {
            res.json({ "error": true, "login": false, "Status": "User Not Found" });
        }
        else {
            let response = await bcrypt.compare(req.body.password, user.password);
            if (response === true) {
                const userId = user._id;
                const token = await jwt.sign({ userId }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                });
                res.json({ "token": token, "error": false, "login": "User Logged In Successfully" });
                res.end();
            } else {
                res.json({ "error": true, "login": "Login Unsuccessfull" });
            }
        }
    } catch (error) {
        res.send(error.message);
    }

};
// Signup new user
exports.signup = async (req, res) => {
    var query = { "mobile": req.body.mobile };
    try {
        let checkuserxistsUser = await User.findOne(query);
        console.log(checkuserxistsUser);
        if (checkuserxistsUser == null) {
            bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                if (!err) {
                    var user = new User();
                    user.mobile = req.body.mobile;
                    user.password = hash;
                    await user.save();
                    const userId = user._id;
                    const token = await jwt.sign({ userId }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                    });
                    res.json({ "token": token, "error": false, "status": "User Created Successfully" });
                    res.end();
                }
            });

        } else {
            res.json({ "status": "User Already Exists", "error": true })
                .status(200);
        }
    } catch (error) {
        res.json({ "status": error.message, "error": true })
    }
};

//Add New Contacts
exports.viewRatings = async (req, res) => {
    if (req.headers.authorization != "" || req.headers.authorization != null) {
        const tokenValidate = await validatetoken(req, res);
        if (tokenValidate == true) {
            userId = await auth.getUid(req.headers.authorization);
            let user = await User.findById(userId);
            if (user == null) {
                res.json({ "status": "User Not Found", "error": true }).status(200);
            } else {
                let ratings = await Rides.aggregate([{$match:{user:userId}}, {$group:{_id:"_id","Average":{$avg:"$urating"}}}])
                if(ratings.length==0) ratings=1;
                else ratings =ratings[0]["Average"];
                res.json({ "ratings": ratings, "error": false }).status(200);
            }
        }
    } else {
        res.json({ "error": true, "status": "Token Not Found" });
    }
};

exports.createRide = async (req, res) => {
    try {
        if (req.headers.authorization != "" || req.headers.authorization != null) {
            const tokenValidate = await validatetoken(req, res);
            if (tokenValidate == true) {
                userId = await auth.getUid(req.headers.authorization);
                let user = await User.findById(userId);
                if (user == null) {
                    res.json({ "status": "User Not Found", "error": true }).status(200);
                } else {
                    let rider = await Rider.findById(req.query.riderId);
                    if(rider==null) {
                        return  res.json({ "status": "Rider Not Found", "error": true }).status(200);
                    } else {
                        let ride = new Rides();
                        ride.start =  "DEL";
                        ride.end  ="GUR";
                        ride.rider = rider._id;
                        ride.user = user._id;
                        await ride.save();
                        return  res.json({ "ride": ride, "error": false }).status(200);
                    }
                }
            }
        } else {
            res.json({ "error": true, "status": "Token Not Found" });
        }
    }
    catch(err) {
        res.json({ "error": true, "status": "Error Creating Ride" });

    }
};


exports.rateRide = async (req, res) => {
    try {
        if (req.headers.authorization != "" || req.headers.authorization != null) {
            const tokenValidate = await validatetoken(req, res);
            if (tokenValidate == true) {
                userId = await auth.getUid(req.headers.authorization);
                let user = await User.findById(userId);
                if (user == null) {
                    res.json({ "status": "User Not Found", "error": true }).status(200);
                } else {
                    let ride = await Rides.findById(req.query.rideId);
                    if(ride==null) {
                        return  res.json({ "status": "Ride Not Found", "error": true }).status(200);
                    } else {
                        ride.rrating = parseFloat(req.query.rating) < 0 ? 1 :  parseFloat(req.query.rating) > 5 ? 5 : parseFloat(req.query.rating); 
                        await ride.save();
                        return  res.json({ "status": "Ride Driver Rated Successfully", "error": true }).status(200);
                    }
                }
            }
        } else {
            res.json({ "error": true, "status": "Token Not Found" });
        }
    }
    catch(err) {
        res.json({ "error": true, "status": "Error Rating Ride" });

    }
};



