// Create a new router
const express = require("express")
const router = express.Router()

const redirectlogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); // send non-logged-in users to login page
    } else {
        next();
    }
};

router.get('/search', redirectlogin, function (req, res, next){
    res.render("search.ejs")
});

router.get('/search_result', redirectlogin, function (req, res, next) {
    
    // Extract the user's search term from the query string
    let searchTerm = req.query.keyword;

    // SQL query using a wildcard match to support partial searches
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    
    // Wrap the search term in '%' so SQL finds any titles containing it
    let searchWildcard = "%" + searchTerm + "%";

    // Run the database query
    db.query(sqlquery, [searchWildcard], (err, result) => {
        if (err) {
            next(err);      // Pass any errors to Express error handler
        } else {
            // Render the results page with the list of matching books
            res.render("search_result.ejs", {searchResults: result, searchTerm: searchTerm});
        }
    });
});

// Display all books in a list, rendered through template "list.ejs"
router.get('/list', redirectlogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books

    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

// Bargain books GET route
router.get('/bargainbooks', redirectlogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render('bargainbooks.ejs', {bargainList:result});
    });
});

// Redirect the user to '/bookadded' page, save the data in database and display message.
router.post('/bookadded', redirectlogin, function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 


// Export the router object so index.js can access it
module.exports = router
