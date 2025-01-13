import React from 'react';
import { useState, useEffect } from 'react';

const Dashboard = ({userId, setIsLoggedIn, setUserId}) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`http://localhost:5001/dashboard`);

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
        fetchPlaylists();
    }, []);

    const handlePlaylistClick = (playlist) => {
        window.location.href = `http://localhost:5173/dashboard/playlist?playlistId=${playlist.id_playlist}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
                <h2 className="text-3xl font-bold mb-4 text-[#40513B]">Loading playlists...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
                <h2 className="text-3xl font-bold mb-4 text-red-500">Error</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <h2 className="text-3xl font-bold mb-4 text-[#40513B]">Created Playlists</h2>
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : playlists.length > 0 ? (
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
                        {playlists.map((playlist) => (
                            <button
                            onClick={() => handlePlaylistClick(playlist)}
                                key={playlist.id}
                                className="w-48 h-48 bg-[#609966] text-white rounded-md hover:bg-[#40513B] transition duration-300 ease-in-out flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold">{playlist.name}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>There are no playlists yet.</p>
            )}
        </div>
    );
};
export default Dashboard;