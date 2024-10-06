const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public folder (for serving home.html)
app.use(express.static('public'));

/**
 * Route: /home
 * - Serves the home.html file that has an <h1> tag with the message 
 *   "Welcome to ExpressJs Tutorial".
 */
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

/**
 * Route: /profile
 * - Returns all the details from the user.json file as JSON format.
 */
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading user data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

/**
 * Route: /login
 * - Accepts username and password as JSON body parameters.
 * - Validates the username and password against the data in user.json.
 * - Sends appropriate responses based on whether the credentials are valid or not.
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('user.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading user data');
    } else {
      const user = JSON.parse(data);
      if (user.username === username && user.password === password) {
        res.json({ status: true, message: 'User is valid' });
      } else if (user.username !== username) {
        res.json({ status: false, message: 'Username is invalid' });
      } else if (user.password !== password) {
        res.json({ status: false, message: 'Password is invalid' });
      }
    }
  });
});

/**
 * Route: /logout
 * - Accepts the username as a query parameter and displays a logout message in HTML format.
 */
router.get('/logout', (req, res) => {
  const username = req.query.username;
  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send('No username provided for logout.');
  }
});

/**
 * Error handling middleware
 * - Handles server errors and returns a 500 page with the message "Server Error".
 */
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

// Redirect root URL ("/") to "/home"
router.get('/', (req, res) => {
  res.redirect('/home');
});

// Use the router
app.use('/', router);

// Start the server
const PORT = process.env.port || 8081;
app.listen(PORT, () => {
  console.log(`Web server is listening at port ${PORT}`);
});
