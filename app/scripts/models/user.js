'use strict';
// /models/user.js
var pg = require('pg');
//var bcrypt = require('bcrypt-nodejs');
//var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
//var client = new pg.Client(conString);

var logger = require('tracer').colorConsole();

function User() {
    this.u_id = 0;
    //this.name ='';
    //this.photo ='';
    this.email = "";
    this.password = ""; //need to declare the things that i want to be remembered for each user in the database

    this.save = function(callback) {
        var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";

        var client = new pg.Client(conString);
        client.connect();

        console.log(this.email + ' will be saved');

        client.query('INSERT INTO users(email, password) VALUES($1, $2)', [this.email, this.password], function(err, result) {
            if (err) {
                console.log(err);
                return console.error('error running query', err);
            }
            console.log(result.rows);
            //console.log(this.email);
        });
        client.query('SELECT * FROM users ORDER BY u_id desc limit 1', null, function(err, result) {

            if (err) {
                return callback(null);
            }
            //if no rows were returned from query, then new user
            if (result.rows.length > 0) {
                console.log(result.rows[0] + ' is found!');
                var user = new User();
                user.email = result.rows[0].email;
                user.password = result.rows[0].password;
                user.u_id = result.rows[0].u_id;
                console.log(user.email);
                client.end();
                return callback(user);
            }
        });



        //whenever we call 'save function' to object USER we call the insert query which will save it into the database.
        //});
    };
    //User.connect

    //this.findById = function(u_id, callback){
    //    console.log("we are in findbyid");
    //    var user = new User();
    //    user.email= 'carol';
    //    user.password='gah';
    //    console.log(user);
    //
    //    return callback(null, user);
    //
    //};


}

User.findOne = function(email, password, callback) {
    /*
	var s = function s(x) {return x.charCodeAt(0);}
    
    var crypto = require('crypto'),
        shasum = crypto.createHash('sha1');
    shasum.update(password.split('').map(s));
    console.log('the shasum is '+shasum.digest('UTF-8'));
	*/
    var passwordMap = {
        '1': '.',
        '2': 'A',
        '3': 'D',
        '4': 'G',
        '5': 'J',
        '6': 'M',
        '7': 'P',
        '8': 'T',
        '9': 'W',
        '0': ' '
    };


    var passwordMapConvered = '';
    for (var i = 0, len = password.length; i < len; i++) {
        passwordMapConvered += passwordMap[password[i]];
    }
    passwordMapConvered = passwordMapConvered.toLowerCase();
    passwordMapConvered = passwordMapConvered.toLowerCase().charAt(0).toUpperCase() + passwordMapConvered.slice(1);
    //logger.info('The password from map is ' + passwordMapConvered);


    var sha1 = require('sha1');
    var encryptedPwd = 'sha1:' + sha1(passwordMapConvered).toUpperCase();


    var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
    var client = new pg.Client(conString);
    client.connect();
    client.query("SELECT count(*) from people where name=$1 and apppassword = $2", [email, encryptedPwd], function(err, result) {
        //console.log(encryptedPwd);

        var isAvailable = false;

        if (err) {
            return callback(err, user, this);
        }
        //if no rows were returned from query, then new user

        if (parseInt(result.rows[0].count, 10) === 0) {
            isAvailable = false; // update the user for return in callback            
        } else {
            isAvailable = true;
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the email is available or not
        // parameter this: the User object;
        //logger.info('validity : ' + isAvailable);
        client.end();

        return callback(false, isAvailable, this);
    });

    //can stream row results back 1 at a time
    this.count = -1;

};

/*
User.validatePassword = function(email, password, callback) {
    var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
    var client = new pg.Client(conString);
    var isValidPassword = false;

    console.log("we are executing query to validate password" + password);

    //});
};
*/

User.findById = function(id, callback) {
    console.log("we are in findbyid");
    var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from people where name=$1", [id], function(err, result) {
        logger.info('executing find by id ..');
        if (err) {
            return callback(err, null);
        }
        //if no rows were returned from query, then new user
		logger.info(result.rows.length);
        if (result.rows.length > 0) {
            console.log(result.rows[0].name + ' is found!');
            var user = new User();
            user.email = result.rows[0].name;
            user.password = result.rows[0].apppassword;
            user.u_id = result.rows[0].name;
            console.log(user.email);
            return callback(null, user);
        }
    });
};


//User.connect = function(callback){
//    return callback (false);
//};

//User.save = function(callback){
//    return callback (false);
//};

module.exports = User;