const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = require('./spotifyApi'); // Import the Spotify API utility

const app = express();
const port = 5001;

app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create a table for users if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Registration route
const bcrypt = require('bcrypt');

// Registration route
app.post('/register', async (req, res) => {
    const { name, surname, email, password } = req.body;

    console.log('Registration attempt:', { name, surname, email, password }); // Log input values

    const checkQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(checkQuery, [email], async (err, row) => {
        if (err) {
            console.error('Error checking email:', err); // Log error
            return res.status(500).send('Error checking email');
        }
        if (row) {
            console.log('Email already exists:', email); // Log existing email
            return res.status(400).send('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Log hashed password

        const query = `INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, surname, email, hashedPassword], function (err) {
            if (err) {
                console.error('Error registering user:', err); // Log error
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password }); // Log input values

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if (err) {
            console.error('Error querying the database:', err); // Log error
            return res.status(500).json({ message: 'Error querying the database' });
        }

        if (!row) {
            console.log('User not found for email:', email); // Log user not found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the plain password with the hashed password
        const match = await bcrypt.compare(password, row.password);
        console.log('Password match result:', match); // Log result of password comparison

        if (!match) {
            console.log('Invalid password for email:', email); // Log invalid password
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Successful login
        console.log('Login successful for email:', email); // Log successful login
        return res.status(200).json({ message: 'Login successful' });
    });
});

// Update email endpoint
app.post('/update-email', (req, res) => {
    const { userId, currentEmail, newEmail } = req.body;

    // Validate input
    if (!userId || !currentEmail || !newEmail) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the new email already exists
    db.get('SELECT * FROM users WHERE email = ?', [newEmail], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (row) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Check if the current email matches the user's email
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.email !== currentEmail) {
                return res.status(401).json({ message: "Current email does not match" });
            }

            // Update email in the database
            db.run('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], function (err) {
                if (err) {
                    return res.status(500).json({ message: "Failed to update email" });
                }

                res.status(200).json({ message: "Email updated successfully" });
            });
        });
    });
});

// Spotify API routes
app.get('/spotify/auth', (req, res) => {
    // Define the scopes for authorization; these are the permissions we ask from the user.
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
    // Redirect the client to Spotify's authorization page with the defined scopes.
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/spotify/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error === 'access_denied') {
        console.error('Access denied:', error);
        res.redirect('http://localhost:5173/settings?error=access_denied');
        return; 
    }

    // Exchange the code for an access token and a refresh token.
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        // Set the access token and refresh token on the Spotify API object.
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        // Refresh the access token periodically before it expires.
        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyApi.setAccessToken(accessTokenRefreshed);
        }, expiresIn / 2 * 1000); // Refresh halfway before expiration.

        // Send a success message to the user.
        res.redirect('http://localhost:5173/settings');

    }).catch(error => {
        console.error('Error getting Tokens:', error);
        res.send('Error getting tokens');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
