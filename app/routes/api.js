
 var User   = require('../models/user')
   , jwt    = require('jsonwebtoken')
   , config = require('../../config')
   , secret = config.secret // secret for creating tokens
   ;


module.exports = function(app, express) {

    // get an instance of the express router
    var apiRouter = express.Router();

    // route for authenticating users
    apiRouter.post('/authenticate', function(req, res) {

        console.log(req.body);

        // find the user
        // select the name username and password explicitly
        User.findOne({ username: req.body.username })
            .select('name username password')
            .exec(function(err, user) {

                if (err) {
                    throw err;
                }

                // no user with that username was found
                if (!user) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. User not found.'
                    });
                } else if (user) {

                    // check if password matches
                    var validPassword = user.comparePassword(req.body.password);

                    if (!validPassword) {
                        res.json({
                            success: false,
                            message: 'Authentication failed. Wrong password.'
                        });
                    } else {

                        // if user is found and password is correct
                        // create token
                        var token = jwt.sign({
                            name: user.name,
                            username: user.username
                        }, secret, {
                            expiresInMinutes: 1440 // 24 hours
                        });

                        // return the informatino including token json
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    }
                }

            });

    });





    // middleware to use for all requests
    apiRouter.use(function(req, res, next) {

        // do logging
        console.log('Somebody just came to our app!');

        console.log(req);

        // check header or url param or post param for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // decode token
        if (token) {

            // vertifiy secret and checks expiration
            jwt.verify(token, secret, function(err, decoded) {

                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // everything is good, save to request for use in routes
                    req.decoded = decoded;

                    next();
                }
            });

        } else {

            // no token
            // return an http response of 403 (access forbidden) and an error mesage
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }

    });





    // test route to make sure everything is working
    // access at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({ message: "Welcome to our api" });
    });






    // routes that end in /users
    apiRouter.route('/users')

        // create a user (accessed as POST
        .post(function(req, res) {

            // create a new instance of the User model
            var user = new User();

            // set the user information from request
            user.name     = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;

            // save the user and check for errors
            user.save(function(err) {

                if (err) {

                    // duplicate entry
                    if (err.code == 11000) {
                        return res.json({
                            success: false,
                            message: 'A user with that username already exists.'
                        });
                    } else {
                        return res.send(err);
                    }
                }

                res.json({
                    message: 'User created!'
                });

            });
        })

        // get all the usres
        .get(function(req, res) {
            User.find(function(err, users) {

                if (err) {
                    res.send(err);
                }

                // return the users
                res.json(users);

            });
        });





    // routes that end in /users/:user_id
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {

                if (err) {
                    res.send(err);
                }

                // return user
                res.json(user);

            });
        })


        // update the user with this id
        .put(function(req, res) {

            // user our user model to find th euser we want
            User.findById(req.params.user_id, function(err, user) {

                if (err) {
                    res.send(err);
                }

                // update the users info only if its new
                if (req.body.name) {
                    user.name = req.body.name;
                }

                if (req.body.username) {
                    user.username = req.body.username;
                }

                if (req.body.password) {
                    user.password = req.body.password;
                }

                // save the user
                user.save(function(err) {

                    if (err) {
                        res.send(err);
                    }

                    // return a message
                    res.json({
                        message: 'User updated'
                    });

                });

            });
        })


        // delete user with id
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {

                if (err) {
                    return res.send(err);
                }

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });

    // api endpoint to get user informatino
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });





    return apiRouter;
};