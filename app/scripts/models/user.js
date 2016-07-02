'use strict';
// /models/user.js
var pg = require('pg');
//var bcrypt = require('bcrypt-nodejs');
//var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
//var client = new pg.Client(conString);



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
   
    var user = {
        isAvailable: false,
        isValidPassword: false
    };
    var conString = "postgres://postgres:postgres@localhost:5432/amatyastore";
    var client = new pg.Client(conString);
    //var isAvailable = false; //we are assuming the email is taking
    //var email = this.email;
    //var rowresult = false;
    //console.log(email + ' is in the findOne function test');
    //check if there is a user available for this email;
    client.connect();
    //client.connect(function(err) {
    ////    //console.log(this.photo);
    //    console.log(email);
    //    if (err) {
    //        return console.error('could not connect to postgres', err);
    //    }
    //console.log("we are executing query");
    var queryIsAvailable = client.query("SELECT count(*) from people where name=$1", [email], function(err, result) {
        if (err) {
            return callback(err, user, this);
        }
        //if no rows were returned from query, then new user
        //console.log(result.rows[0].count);
        if (result.rcows[0].count === 0) {
            this.user.isAvailable = false; // update the user for return in callback
            ///email = email;
            //password = result.rows[0].password;
            console.log(email + ' is not available!');
        } else {
            user.isAvailable = true;
            //email = email;
            console.log(email + ' is  available');
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the email is available or not
        // parameter this: the User object;

        client.end();
        return callback(false, user, this);
    });

    //can stream row results back 1 at a time
    this.count = -1;


    queryIsAvailable.on("row", function(row, result) {
        result.addRow(row);
        console.log(row);
    });

    queryIsAvailable.on("end", function(result) {
        console.log(result.rows);
        client.end();
    });



    /*
        client.query("SELECT count(*) from people where name=$1 and apppassword=$2", [email, password], function(err, result) {
            console.log('Query executed successfully');
            if (err) {
                return callback(err, user.isValidPassword, this);
            }
            //if no rows were returned from query, then new user
            console.log('The value of result is ' + result.rows[0].count);
            if (result.rows[0].count = 0) {
                user.isValidPassword = false; // update the user for return in callback
                ///email = email;
                //password = result.rows[0].password;
                console.log(email + ' is not isValidPassword!');
            } else {
                user.isValidPassword = true;
                //email = email;
                console.log(email + ' is  isValidPassword');
            }
            //the callback has 3 parameters:
            // parameter err: false if there is no error
            //parameter isNotAvailable: whether the email is available or not
            // parameter this: the User object;

            client.end();
            return callback(false, user, this);
        });
    */


    //});
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
    client.query("SELECT * from people where id=$1", [id], function(err, result) {

        if (err) {
            return callback(err, null);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0) {
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email = result.rows[0].email;
            user.password = result.rows[0].password;
            user.u_id = result.rows[0].u_id;
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