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
exports.all = async (req, res) => {
  let rides = await Rides.find();
  res.json({ "error": false, "Rides": rides });
};
