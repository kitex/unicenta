'use strict';
//all the routes for our application
module.exports = function(app, passport) {
   
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render(__dirname +'/../views/index.ejs'); // load the index.ejs file
    });

	 app.get('/chat', function(req, res) {
		 console.log(req.user)
        res.render(__dirname +'/../views/chat/chat.ejs',{title: 'Chat', user: req.user}); // load the index.ejs file
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render(__dirname +'/../views/login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashlists', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
	
	app.post('/products', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render(__dirname +'/../views/signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
	
	// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('isLoggedin');
        return next();
    }
    console.log('is not logged in');

    // if they aren't redirect them to the home page
    res.redirect('/');
}
	
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render(__dirname +'/../views/profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
        console.log(req.user);
    });
	
	 app.get('/dashlists', isLoggedIn, function(req, res) {
        res.render(__dirname +'/../views/dashboards/dashlists.ejs', {
            user: req.user // get the user out of session and pass to template
        });
        console.log(req.user);
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));
	
	

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

