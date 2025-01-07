import React, { useState, useEffect } from 'react';





const PlaylistDisplay = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const mood = queryParams.get('mood');
    // State to store playlists
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);

    // Fetch playlists every time the page is loaded or the mood changes
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`http://localhost:5001/playlist/display?mood=${mood}`); // Adjust endpoint if necessary
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPlaylists(data); // Set fetched playlists to state
                console.log('Playlists fetched:', data);
            } catch (err) {
                console.error('Error fetching playlists:', err);
                setError(err.message); // Set error message
            }
        };

        fetchPlaylists();
    }, [mood]);



    return (
        <div>
            <h2>Created Playlists</h2>
            {error ? (
                <p>Error: {error}</p>
            ) : playlists.length > 0 ? (
                <ul>
                    {playlists.map((playlist, index) => (
                        <li key={index}>{playlist.split(':')[2]}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading playlists...</p>
            )}
        </div>
    );
};

export default PlaylistDisplay;
