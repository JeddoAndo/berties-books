# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

---

# dotenv Implementation

## The application uses the dotenv module to securely load environment variables instead of hardcoding database credentials in index.js.

## 1. Install dotenv:
`npm install dotenv`

## 2. Create a `.env` file in the project root and store the required database settings as environment variables.

## 3. Add `.env` to `.gitignore` so it is not pushed to GitHub.

## 4. Load the variables in index.js:
`require('dotenv').config();`

## 5. Use process.env.* values when creating the MySQL connection pool.

---
## Audit Logging

To improve security and tracebility, the application records every login attempt in an `audit` table. Each entry store the username, whether the attempt was successful, and the timestamp of the attempt.

The `/users/loggedin` route was updated to insert an audit entry after every login operation (both successful and failed). A new route `/users/audit`, displays the full audit history by querying the audit table and rendering the results in `audit.ejs`

---

### Routes
`/books/list`
`/books/addbook`
`/books/bargainbooks`
`/books/search`
`/users/register`
`/users/list`
`/users/login`
`/users/loggedin`
`/users/audit`

---

### Access Control
Access control was implemented using a custom `redirectlogin` middleware function. Protectd routes check for the presence of `req.session.userId` and redirect unauthenticated users to the login page.

Protected routes include:
- `/users/list`
- `/users/audit`
- All `/books/*` routes (list, addbook, bargainbooks, search, etc,.)

Public routes include:
- Homepage (`/`), About page
- `/users/register`, `/users/registered`
- `/users/login`, `/users/loggedin`

This ensures only logged-in users can access or modify book and user data.

---

### Sanitisation

I added express-sanitizer to remove potentially dangerous HTML/Javascript from user input fields. Only the username, first name, and last name fields were sanitised, because these are displayed in the HTML output and could be used for XSS attacks.

I did not sanitise the password or email fields. Passwords must remain unchanged to allow correct hashing, and sanitising emails can corrupt valid characters such as '@' and '.'.

### Additional sanitisation

I extendd sanitisation to other user input fields throughout the application to prevent cross-site scripting (XSS) attacks. This included sanitising the username during login, the book name on the add book page, and the search query on the search page. I did not sanitise passwords or emails, as this could corrupt valid input or break password hashing.