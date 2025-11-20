# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

---

# dotenv Implementation

## The application uses the dotenv module to securely load environment
# variables instead of hardcoding database credentials in index.js.

## 1. Install dotenv:
npm install dotenv

## 2. Create a `.env` file in the project root and store the required
##    database settings as environment variables.

## 3. Add `.env` to `.gitignore` so it is not pushed to GitHub.

## 4. Load the variables in index.js:
require('dotenv').config();

## 5. Use process.env.* values when creating the MySQL connection pool.

---
## Audit Logging

To improve security and tracebility, the application records every login attempt in an `audit` table. Each entry store the username, whether the attempt was successful, and the timestamp of the attempt.

The `/users/loggedin` route was updated to insert an audit entry after every login operation (both successful and failed). A new route `/users/audit`, displays the full audit history by querying the audit table and rendering the results in `audit.ejs`