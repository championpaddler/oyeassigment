const user = require('../controllers/user.js');
const rider = require('../controllers/rider.js');
const rides = require('../controllers/rides');


module.exports = (app) => {

    // Only to get details of rides
    app.get('/rides', rides.all);


    app.post('/user/signup/', user.signup);
    app.post('/user/login/', user.login);


    app.post('/rider/signup/', rider.signup);
    app.post('/rider/login/',rider.login);

    // Creating Ride
    app.post('/user/create/', user.createRide);

    // Rating Api
    app.put('/user/rateride/', user.rateRide);
    app.put('/rider/rateuser/', rider.rateUser);


    // View Rating Api
    app.get('/user/ratings/', user.viewRatings);
    app.get('/rider/ratings/', rider.viewRatings);
}