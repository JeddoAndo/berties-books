// routes/api.js
const express = require('express');
const router = express.Router();

// GET /api/books
router.get('/books', function (req, res, next) {

    // Query database to get all the books
    let sqlquery = "SELECT * FROM books";

    // Execute the SQL query
    db.query(sqlquery, (err, result) => {

        if (err) {
            // Return the error as JSON
            res.json(err);
            next(err);
        }
        else {
            // Return the book list as JSON
            res.json(result);
        }
    });
});

module.exports = router;