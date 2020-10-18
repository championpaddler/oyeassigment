const {Rider,Rides} = require('../models/model.js');
const jwt = require('../node_modules/jsonwebtoken');
const auth = require('../utilities/auth');
const validatetoken = auth.validatetoken;
const bcrypt = require('../node_modules/bcrypt');
const saltRounds = 10;
const jwtconfig = require('../config/jwtkey.config');
const jwtKey = jwtconfig.jwtKey
const jwtExpirySeconds = jwtconfig.jwtExpirySeconds;



// Create and Save a new User
exports.login = async (req, res) => {
    try {
        let rider = await Rider.findOne({ "mobile": req.body.mobile });
        if (rider == null) {
            res.json({ "error": true, "login": false, "Status": "Rider Not Found" });
        }
        else {
            let response = await bcrypt.compare(req.body.password, rider.password);
            if (response === true) {
                const userId = rider._id;
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
        let checkuserxistsUser = await Rider.findOne(query);
        console.log(checkuserxistsUser);
        if (checkuserxistsUser == null) {
            bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                if (!err) {
                    var rider = new Rider();
                    rider.mobile = req.body.mobile;
                    rider.password = hash;
                    await rider.save();
                    const userId = rider._id;
                    const token = await jwt.sign({ userId }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                    });
                    res.json({ "token": token, "error": false, "status": "Rider Created Successfully" });
                    res.end();
                }
            });

        } else {
            res.json({ "status": "Rider Already Exists", "error": true })
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
            let user = await Rider.findById(userId);
            if (user == null) {
                res.json({ "status": "User Not Found", "error": true }).status(200);
            } else {
                let ratings = await Rides.aggregate([{$match:{rider:userId}}, {$group:{_id:"_id","Average":{$avg:"$rrating"}}}])
                if(ratings.length==0)  ratings = 1;
                else ratings= ratings[0]['Average'];
                res.json({ "ratings": ratings, "error": false }).status(200);
            }
        }
    } else {
        res.json({ "error": true, "status": "Token Not Found" });
    }
};


exports.rateUser = async (req, res) => {
    try {
        if (req.headers.authorization != "" || req.headers.authorization != null) {
            const tokenValidate = await validatetoken(req, res);
            if (tokenValidate == true) {
                userId = await auth.getUid(req.headers.authorization);
                let rider = await Rider.findById(userId);
                if (rider == null) {
                    res.json({ "status": "Rider Not Found", "error": true }).status(200);
                } else {
                    let ride = await Rides.findById(req.query.rideId);
                    if(ride==null) {
                        return  res.json({ "status": "Ride Not Found", "error": true }).status(200);
                    } else {
                        ride.urating = parseFloat(req.query.rating) < 0 ? 1 :  parseFloat(req.query.rating) > 5 ? 5 : parseFloat(req.query.rating); 
                        await ride.save();
                        return  res.json({ "status": "Ride User Rated Successfully", "error": true }).status(200);
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
