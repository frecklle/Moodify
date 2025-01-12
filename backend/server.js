const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const spotifyApi = require('./spotifyApi');
const bcrypt = require('bcrypt');

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
db.run (`
    CREATE TABLE IF NOT EXISTS playlists (
        id_playlist INT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
`);


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
        return res.status(200).json({ 
            message: 'Login successful', 
            userId: row.id 
        });
    });
});

// Update email endpoint
app.post('/update-email', (req, res) => {
    
    const { userId, currentEmail, newEmail } = req.body;

    console.log("Received request body:", req.body);
    console.log("Received userId:", userId);

    // Validate input
    if (!userId || !currentEmail || !newEmail) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the new email already exists
    db.get('SELECT * FROM users WHERE email = ?', [newEmail], (err, row) => {
        if (err) {
            console.error("Error querying database for new email:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (row) {
            console.log("New email already in use:", newEmail);
            return res.status(400).json({ message: "Email already in use" });
        }

        // Check if the current email matches the user's email
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
            console.log("Database query result for userId:", user);
            if (err) {
                console.error("Error querying database for userId:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (!user) {
                console.log("User not found for userId:", userId);
                return res.status(404).json({ message: "User not found" });
            }

            if (user.email !== currentEmail) {
                console.log("Current email does not match:", currentEmail);
                return res.status(401).json({ message: "Current email does not match" });
            }

            // Update email in the database
            db.run('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], function (err) {
                if (err) {
                    console.error("Error updating email:", err);
                    return res.status(500).json({ message: "Failed to update email" });
                }
                console.log("Email updated successfully for userId:", userId);

                res.status(200).json({ message: "Email updated successfully" });
            });
        });
    });
});

app.post('/change-password', (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user exists
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare current password with the stored one
        bcrypt.compare(currentPassword, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Error checking password' });
            }

            if (!result) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash the new password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                // Update the password in the database
                db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        return res.status(500).json({ message: 'Error updating password' });
                    }

                    res.status(200).json({ message: 'Password successfully updated' });
                });
            });
        });
    });
});



// Spotify API routes
app.get('/spotify/auth', (req, res) => {
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'playlist-modify-public', 'playlist-modify-private'];
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

//TODO: change redirect from settings to some other screen
app.get('/spotify/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error === 'access_denied') {
        console.error('Access denied:', error);
        res.redirect('http://localhost:5173/settings?error=access_denied');
        return; 
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyApi.setAccessToken(accessTokenRefreshed);
        }, expiresIn / 2 * 1000); // Refresh halfway before expiration.

        res.redirect('http://localhost:5173/settings');

    }).catch(error => {
        console.error('Error getting Tokens:', error);
        res.send('Error getting tokens');
    });
});

const refreshAccessToken = async () => {
    try {
        const data = await spotifyApi.refreshAccessToken();
        const newAccessToken = data.body['access_token'];
        spotifyApi.setAccessToken(newAccessToken);
        console.log('Access token refreshed:', newAccessToken);
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Could not refresh access token');
    }
};

// Ensure valid token function
const ensureValidToken = async () => {
    const currentToken = spotifyApi.getAccessToken();
    if (!currentToken) {
        console.log('No access token found, refreshing...');
        await refreshAccessToken();
    }
};


app.post("/playlist/save", async (req, res) => {
    const { playlists, mood, userId } = req.body;

    if (!playlists || !Array.isArray(playlists) || !userId) {
        return res.status(400).send('Invalid request data');
    }

    await ensureValidToken();

    try {
        const playlistData = await spotifyApi.createPlaylist(`Moodify - ${mood}`, { 'description': `A playlist for when you're feeling ${mood}`, 'public': true });
        const playlistId = playlistData.body.id;
        const playlistName = playlistData.body.name;

        const trackUris = playlists.map(track => `spotify:track:${track.id}`);
        await spotifyApi.addTracksToPlaylist(playlistId, trackUris);

        // Save playlist to the database
        db.run('INSERT INTO playlists (id_playlist, user_id, name) VALUES (?, ?, ?)', [playlistId, userId, playlistName], function (err) {
            
            if (err) {
                console.error('Error saving playlist to database:', err);
                return res.status(500).send('Error saving playlist to database');
            }

            res.status(201).json({ message: 'Playlist created and saved successfully', playlistId });
            console.error('Playlist created and saved successfully', playlistId );

        });
    } catch (error) {
        console.error('Error saving playlist:', error);
        res.status(500).send('Error saving playlist');
    }
});

app.get("/playlist/display", async (req, res) => {
    const { mood } = req.query;

    const moodToGenre = {
        'happy': ['pop', 'dance', 'electronic'],
        'neutral': ['indie', 'alternative', 'folk'],
        'sad': ['acoustic', 'blues', 'soul'],
        'angry': ['metal', 'rock', 'punk'],
        'cool': ['jazz', 'funk', 'swing'],
        'sleepy': ['ambient', 'chill', 'lofi']
    };

    const getRandomGenre = (mood) => {
        const genres = moodToGenre[mood];
        return genres[Math.floor(Math.random() * genres.length)];
    };

    const genre = getRandomGenre(mood);


    if (!genre) {
        return res.status(400).send('Invalid mood');
    }

    console.log('Current Access Token:', spotifyApi.getAccessToken());
    await ensureValidToken();
    
    try {
        const tracksData = await spotifyApi.searchTracks(`genre:${genre}`, { limit: 20 });
        const tracks = tracksData.body.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).send('Error creating playlist');
    }
  });


app.get('/dashboard', (req, res) => {
    db.all('SELECT * FROM playlists', (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Error querying database' });
        }

        res.status(200).json(rows);
        // console.log('Query result:', rows);
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
