const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const spotifyApi = require('./spotifyApi');
const bcrypt = require('bcrypt');
const multer = require("multer");

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
                                             password TEXT NOT NULL,
                                             spotifyAccessToken TEXT,
                                             spotifyRefreshToken TEXT,
                                             expiresAt TEXT,
                                             bio TEXT,
                                             username TEXT UNIQUE,
                                             profile_image TEXT
    );
`);
db.run (`
    CREATE TABLE IF NOT EXISTS playlists (
        id_playlist INT NOT NULL,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id_playlist, user_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
`);

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `user_${req.body.userId}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Handle profile picture upload
app.post("/profile/upload", upload.single("file"), (req, res) => {
    const { userId } = req.body;

    if (!userId || !req.file) {
        return res.status(400).json({ error: "User ID and profile image are required." });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Update the user's profile image in the database
    db.run("UPDATE users SET profile_image = ? WHERE id = ?", [filePath, userId], function (err) {
        if (err) {
            console.error('Error updating profile image:', err);
            return res.status(500).json({ error: "Failed to update profile image." });
        }
        res.json({ message: "Profile picture uploaded successfully!", imageUrl: filePath });
    });
});

app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Image not found');
    }
});

app.get("/spotify/status", (req, res) => {
    const accessToken = spotifyApi.getAccessToken();

    if (accessToken) {
        res.json({ connected: true });
    } else {
        res.json({ connected: false });
    }
});

// Registration route
app.post('/register', async (req, res) => {
    const { name, surname, email, password } = req.body;

    console.log('Registration attempt:', { name, surname, email, password });

    const checkQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(checkQuery, [email], async (err, row) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).send('Error checking email');
        }
        if (row) {
            console.log('Email already exists:', email);
            return res.status(400).send('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        const defaultProfilePic = '/uploads/default_profile_pic.jpg'; // Path to your default image

        const query = `INSERT INTO users (name, surname, email, password, profile_image) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [name, surname, email, hashedPassword, defaultProfilePic], function (err) {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        });
    });
});

app.post('/profile/update', (req, res) => {
    const { userId, username, bio } = req.body;

    console.log('Received update request:', { userId, username, bio }); // Log the received data

    // Validate input
    if (!userId || !username || !bio) {
        return res.status(400).json({ message: 'User ID, username, and bio are required.' });
    }

    // Update the user's profile in the database
    db.run(
        'UPDATE users SET username = ?, bio = ? WHERE id = ?',
        [username, bio, userId],
        function (err) {
            if (err) {
                console.error('Error updating profile:', err);
                return res.status(500).json({ message: 'Failed to update profile.' });
            }

            // Check if any rows were updated
            if (this.changes === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.status(200).json({ message: 'Profile updated successfully' });
        }
    );
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

// Endpoint to update profile
app.post("/profile/upload", upload.single("file"), (req, res) => {
    const { userId } = req.body;

    if (!userId || !req.file) {
        return res.status(400).json({ error: "User ID and profile image are required." });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Update the user's profile image in the database
    db.run("UPDATE users SET profile_image = ? WHERE id = ?", [filePath, userId], function (err) {
        if (err) {
            console.error('Error updating profile image:', err);
            return res.status(500).json({ error: "Failed to update profile image." });
        }
        res.json({ message: "Profile picture uploaded successfully!", imageUrl: filePath });
    });
});

// Endpoint to fetch profile
app.get('/profile', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    db.get('SELECT username, bio, profile_image FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(row);
    });
});

app.delete('/delete-account', (req, res) => {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Begin a transaction to ensure atomicity
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Delete the user's playlists first (due to foreign key constraint)
        db.run('DELETE FROM playlists WHERE user_id = ?', [userId], function (err) {
            if (err) {
                console.error('Error deleting user playlists:', err);
                db.run('ROLLBACK'); // Rollback the transaction on error
                return res.status(500).json({ message: 'Error deleting user playlists' });
            }

            // Now delete the user
            db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
                if (err) {
                    console.error('Error deleting user:', err);
                    db.run('ROLLBACK'); // Rollback the transaction on error
                    return res.status(500).json({ message: 'Error deleting user' });
                }

                // Commit the transaction if both operations succeed
                db.run('COMMIT', function (err) {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return res.status(500).json({ message: 'Error committing transaction' });
                    }

                    res.status(200).json({ message: 'Account deleted successfully' });
                });
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


let userEmail = '';

// Spotify API routes
app.get('/spotify/auth', (req, res) => {

    userEmail = req.query.email;

    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'playlist-modify-public', 'playlist-modify-private', 'playlist-modify-private'];
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

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            const expiresIn = data.body['expires_in'];
            const expiresAt = Date.now() + expiresIn * 1000;
            console.log('Access token:', accessToken);
            console.log('Expires at:', expiresAt);

            db.run(
                `UPDATE users SET spotifyAccessToken = ?, spotifyRefreshToken = ?, expiresAt = ? WHERE email = ?`,
                [accessToken, refreshToken, expiresAt, userEmail],
                function (err) {
                    if (err) {
                        console.error('Error saving tokens:', err);
                        return res.status(500).send('Database error');
                    }
                }
            );

            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            // Refresh the access token periodically
            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const accessTokenRefreshed = data.body['access_token'];
                spotifyApi.setAccessToken(accessTokenRefreshed);
            }, expiresIn / 2 * 1000); // Refresh halfway before expiration.

            // Redirect to the home page after successful authentication
            res.redirect('http://localhost:5173/');
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.redirect('http://localhost:5173?error=spotify_auth_failed');
        });
});

const refreshAccessToken = async () => {
    try {
        const data = await spotifyApi.refreshAccessToken();
        const newAccessToken = data.body['access_token'];
        const newExpiresAt = Date.now() + data.body['expires_in'] * 1000;

        spotifyApi.setAccessToken(newAccessToken);

        // Update the database with the new token
        db.run(
            `UPDATE users SET spotifyAccessToken = ?, expiresAt = ? WHERE spotifyRefreshToken = ?`,
            [newAccessToken, newExpiresAt, spotifyApi.getRefreshToken()],
            (err) => {
                if (err) {
                    console.error('Error updating refreshed token:', err);
                } else {
                    console.log('Access token refreshed and saved.');
                }
            }
        );

    } catch (error) {
        console.error('Error refreshing access token:', error);
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
        const playlistData = await spotifyApi.createPlaylist(`Moodify - ${mood}`, { 'description': `A playlist for when you're feeling ${mood} - generated by Moodify`, 'public': false });
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
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    
    db.all('SELECT * FROM playlists WHERE user_id = ?;', [userId], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Error querying database' });
        }

        res.status(200).json(rows);
    });
});

app.get('/dashboard/playlist', async (req, res) => {
    const { playlistId } = req.query;

    await ensureValidToken();

    try {
        const playlistData = await spotifyApi.getPlaylist(playlistId);
        const tracks = playlistData.body.tracks.items.map(item => ({
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists[0].name,
            album: item.track.album.name
        }));
        const playlistName = playlistData.body.name;

        res.status(200).json({ playlistName, tracks });
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).send('Error fetching playlist');
    }
}
);

app.get('/dashboard/playlist/delete', async (req, res) => {
    const { playlistId } = req.query;

    if (!playlistId) {
        return res.status(400).json({ message: 'Playlist ID is required' });
    }

    await ensureValidToken();

    try {
        // Delete playlist from Spotify
        await spotifyApi.unfollowPlaylist(playlistId);

        // Delete playlist from the database
        db.run('DELETE FROM playlists WHERE id_playlist = ?', [playlistId], function (err) {
            if (err) {
                console.error('Error deleting playlist from database:', err);
                return res.status(500).json({ message: 'Error deleting playlist from database' });
            }

            res.status(200).json({ message: 'Playlist deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).send('Error deleting playlist');
    }
}
);

app.get('/dashboard/playlist/link', async (req, res) => {
    const { playlistId } = req.query;

    try {
        const playlistData = await spotifyApi.getPlaylist(playlistId);
        const externalUrl = playlistData.body.external_urls.spotify;

        res.status(200).json({ link: externalUrl });
    } catch (error) {
        console.error('Error fetching playlist link:', error);
        res.status(500).send('Error fetching playlist link');
    }
});

app.get('/dashboard/playlist/edit', async (req, res) => {
    const { playlistId, newName } = req.query;

    // Validate input
    if (!playlistId || !newName) {
        return res.status(400).json({ message: 'Playlist ID and new name are required' });
    }

    try {
        // Ensure the Spotify token is valid
        await ensureValidToken();

        // Update the playlist name on Spotify
        await spotifyApi.changePlaylistDetails(playlistId, { name: newName });

        // Update the playlist name in the database
        db.run('UPDATE playlists SET name = ? WHERE id_playlist = ?', [newName, playlistId], function (err) {
            if (err) {
                console.error('Error updating playlist name in the database:', err);
                return res.status(500).json({ message: 'Error updating playlist name in the database' });
            }

            // If both operations succeed, respond with success
            res.status(200).json({ message: 'Playlist name updated successfully' });
        });
    } catch (error) {
        // Handle errors from the Spotify API or other unexpected issues
        console.error('Error updating playlist name:', error);

        if (error.body && error.body.error) {
            // If Spotify API provides a specific error message
            return res.status(error.body.error.status || 500).json({
                message: error.body.error.message || 'Error updating playlist name on Spotify',
            });
        }

        // Generic error fallback
        res.status(500).json({ message: 'An unexpected error occurred while updating the playlist name' });
    }
});

app.get('/dashboard/playlist/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    await ensureValidToken();

    try {
        const searchResults = await spotifyApi.searchTracks(query, { limit: 5 });
        const tracks = searchResults.body.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error searching tracks:', error);
        res.status(500).send('Error searching tracks');
    }
});


app.get('/dashboard/playlist/add', async (req, res) => {
    const { playlistId, trackId } = req.query;

    if (!playlistId || !trackId) {
        return res.status(400).json({ message: 'Playlist ID and track ID are required' });
    }

    await ensureValidToken();

    try {
        await spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${trackId}`]);

        const trackData = await spotifyApi.getTrack(trackId);
        const track = {
            id: trackData.body.id,
            name: trackData.body.name,
            artist: trackData.body.artists[0].name,
            album: trackData.body.album.name
        };

        res.status(200).json({ message: 'Track added successfully', track });
    } catch (error) {
        console.error('Error adding track to playlist:', error);
        res.status(500).send('Error adding track to playlist');
    }
});


app.get('/dashboard/playlist/collaborative', async (req, res) => {
    const { playlistId, email } = req.query;

    if (!playlistId || !email) {
        return res.status(400).json({ message: 'Playlist ID and email are required' });
    }

    await ensureValidToken();

    try {
        // Get the user ID from the email
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Error querying database for user:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Make the playlist collaborative on Spotify
            await spotifyApi.changePlaylistDetails(playlistId, { collaborative: true });

            // Add the user as a collaborator in the database
            // Get the playlist name from Spotify
            const playlistData = await spotifyApi.getPlaylist(playlistId);
            const playlistName = playlistData.body.name;

            // Check if the user is already a collaborator
            db.get('SELECT * FROM playlists WHERE id_playlist = ? AND user_id = ?', [playlistId, user.id], (err, row) => {
                if (err) {
                    console.error('Error querying database for existing collaborator:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                if (row) {
                    return res.status(200).json({ message: 'User is already a collaborator' });
                }

                // Add the user as a collaborator in the database
                db.run('INSERT INTO playlists (id_playlist, user_id, name) VALUES (?, ?, ?)', [playlistId, user.id, playlistName], function (err) {
                    if (err) {
                        console.error('Error adding collaborator to database:', err);
                        return res.status(500).json({ message: 'Error adding collaborator to database' });
                    }

                    res.status(200).json({ message: 'Playlist is now collaborative' });
                });
            });
        });
    } catch (error) {
        console.error('Error making playlist collaborative:', error);
        res.status(500).send('Error making playlist collaborative');
    }
});

const restoreSpotifyTokens = () => {
    db.get('SELECT spotifyAccessToken, spotifyRefreshToken, expiresAt FROM users WHERE spotifyAccessToken IS NOT NULL LIMIT 1', async (err, row) => {
        if (err) {
            console.error('Error retrieving stored tokens:', err);
            return;
        }

        if (row) {
            const { spotifyAccessToken, spotifyRefreshToken, expiresAt } = row;
            const currentTime = Date.now();

            spotifyApi.setAccessToken(spotifyAccessToken);
            spotifyApi.setRefreshToken(spotifyRefreshToken);

            console.log('Restored Spotify tokens from database.');

            // If token is expired, refresh it
            if (currentTime >= expiresAt) {
                console.log('Access token expired, refreshing...');
                await refreshAccessToken();
            }
        } else {
            console.log('No stored Spotify tokens found.');
        }
    });
};

// Start the server
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    restoreSpotifyTokens();
});