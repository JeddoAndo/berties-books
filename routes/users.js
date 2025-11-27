// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Redirect middleware
const redirectlogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to login page
    } else {
        next();
    }
};

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

// Display login form
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

// Handle registration form submission
router.post('/registered', function (req, res, next) {

    const plainPassword = req.body.password;    // password from the form

    // Hash the password before storing it
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // Insert user into database
        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)";

        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ];

        // Display 
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } else {
                let result = 'Hello ' + req.body.first + ' ' + req.body.last +
                ' you are now registered! We will send an email to you at ' + req.body.email;

                result += ' Your password is: ' + req.body.password +
                ' and your hashed password is: ' + hashedPassword;

                res.send(result);
            }
        });
    });                                                           
}); 

// List all registered users (without passwords)
router.get('/list', redirectlogin, function (req, res, next) {

    let sqlquery = "SELECT username, first, last, email FROM users";

    db.query(sqlquery, (err, result) => {
        if(err) {
            next(err);
        } else {
            res.render("listusers.ejs", { userList: result });
        }
    });
});

// Handle login form submission
router.post('/loggedin', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    // Retriee the hashed password for this username
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";

    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            next(err);
        }

        // If no user found -> login fails
        else if (result.length === 0) {
            let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
            db.query(auditQuery, [username, false]);

            res.send("Login failed: user not found.");
        }

        // If user found -> extract hashedPassword
        else {
            let hashedPassword = result[0].hashedPassword;

            // Compare typed password with stored hashed password
            bcrypt.compare(password,hashedPassword, function(err, match) {

                if (err) {
                    next(err);
                }

                // match === true -> login access
                else if (match === true) {

                    // Save session here when login is successful
                    req.session.userId = req.body.username;

                    let auditQuery = "INSERT INTO audit (username, success) VALUE (?, ?)";
                    db.query(auditQuery, [username, true]);
                    res.send("Login successful! Welcome, " + username + ".");
                }

                // match === false -> incorrect password
                else {
                    let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
                    db.query(auditQuery, [username, false]);
                    res.send("Login failed: incorrect password.");
                }
            });
        }
    });
});

// Show audit log
router.get('/audit', function(req, res, next) {

    let sqlquery = "SELECT * FROM audit ORDER BY timestamp DESC";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("audit.ejs", {auditList: result});
        }
    });
});

// Export the router object so index.js can access it
module.exports = router
