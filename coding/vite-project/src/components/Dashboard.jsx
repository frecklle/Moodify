import React, { useState, useEffect } from 'react';
import FeedbackMessage from './FeedbackMessage';

const Dashboard = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');
        if (userIdFromUrl) {
            setUserId(userIdFromUrl);
        }
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`http://localhost:5001/dashboard?userId=${userId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPlaylists(data);
                console.log('Playlists:', data);
            } catch (err) {
                console.error('Error fetching playlists:', err);
                setError(err.message); // Set error message
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchPlaylists();
        }
    }, [userId]);

    const handlePlaylistClick = (playlist) => {
        window.location.href = `http://localhost:5173/dashboard/playlist?playlistId=${playlist.id_playlist}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] p-6">
                <h2 className="text-4xl font-bold mb-8 text-[#40513B] animate-pulse">
                    Loading playlists...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] p-6">
                <h2 className="text-4xl font-bold mb-8 text-red-500">Error</h2>
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] p-6">
            {/* Header */}
            <h2 className="text-4xl font-bold mb-8 text-[#40513B] animate-fade-in">
                Your Playlists
            </h2>

            {/* Playlist List */}
            {playlists.length > 0 ? (
                <div className="w-full max-w-4xl">
                    <ul className="space-y-6">
                        {playlists.map((playlist) => (
                            <li key={playlist.id} className="flex items-center justify-between bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                                <span className="text-xl font-semibold text-[#40513B]">{playlist.name}</span>
                                <button
                                    onClick={() => handlePlaylistClick(playlist)}
                                    className="px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white text-lg font-semibold rounded-xl hover:bg-[#40513B] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                >
                                    View Playlist
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-[#40513B] text-lg">You have no playlists yet. Create one to get started!</p>
            )}
        </div>
    );
};

export default Dashboard;
