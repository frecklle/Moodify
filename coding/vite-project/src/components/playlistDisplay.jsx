import React, { useState, useEffect } from 'react';

const PlaylistDisplay = ({ userId, setIsLoggedIn, setUserId }) => {
    const queryParams = new URLSearchParams(window.location.search);
    const mood = queryParams.get('mood');
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);

    // Fetch playlists every time the page is loaded or the mood changes
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`http://localhost:5001/playlist/display?mood=${mood}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPlaylists(data); // Set fetched playlists to state
            } catch (err) {
                console.error('Error fetching playlists:', err);
                setError(err.message); // Set error message
            }
        };
        fetchPlaylists();
    }, [mood]);

    const savePlaylist = async () => {
        try {
            const response = await fetch('http://localhost:5001/playlist/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlists, mood, userId }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
            }

            const result = await response.json();
            console.log('Playlist saved:', result);

            setError(null);
            window.location.href = `http://localhost:5173/dashboard?userId=${userId}`;
        } catch (err) {
            console.error('Error saving playlist:', err);
            setError(err.message || 'An unknown error occurred.');
        }
    };

    return (
        <div className="text-black flex flex-col justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] p-6">
            {/* Header */}
            <h2 className="text-4xl font-bold mb-8 text-[#40513B] animate-fade-in">
                Created Playlists
            </h2>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-lg font-semibold mb-6 animate-fade-in">
                    Error: {error}
                </p>
            )}

            {/* Playlist Table */}
            {playlists.length > 0 ? (
                <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl animate-fade-in">
                    <div className="max-h-[60vh] overflow-y-auto"> {/* Add scrollable container */}
                        <table className="w-full">
                            <thead>
                            <tr className="bg-[#40513B] text-white">
                                <th className="px-6 py-4 text-left rounded-tl-2xl">Name</th>
                                <th className="px-6 py-4 text-left">Artist</th>
                                <th className="px-6 py-4 text-left rounded-tr-2xl">Album</th>
                            </tr>
                            </thead>
                            <tbody>
                            {playlists.map((playlist, index) => (
                                <tr
                                    key={playlist.id}
                                    className={`${index % 2 === 0 ? 'bg-[#EDF1D6]' : 'bg-white'} hover:bg-[#609966] hover:text-white transition-all duration-200`}
                                >
                                    <td className="px-6 py-4">{playlist.name}</td>
                                    <td className="px-6 py-4">{playlist.artist}</td>
                                    <td className="px-6 py-4">{playlist.album}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Save Playlist Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={savePlaylist}
                            className="px-8 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white text-lg font-semibold rounded-xl hover:from-[#40513B] hover:to-[#609966] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Save Playlist
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-[#40513B] text-lg animate-fade-in">Loading playlists...</p>
            )}
        </div>
    );
};

export default PlaylistDisplay;
