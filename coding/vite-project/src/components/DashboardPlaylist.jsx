import React, { useState, useEffect } from 'react';

const DashboardPlaylist = ({userId, setIsLoggedIn, setUserId}) => {
    const queryParams = new URLSearchParams(window.location.search);
    const playlistId = queryParams.get('playlistId');
    // State to store playlists
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);

    // Fetch playlists every time the page is loaded or the mood changes
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:5001/dashboard/playlist?playlistId=${playlistId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTracks(data); // Set fetched playlists to state
                console.log('Tracks:', data);
            } catch (err) {
                console.error('Error fetching playlists:', err);
                setError(err.message); // Set error message
            }
        };

        fetchPlaylist();
    }, [playlistId]);




    return (
        <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <h2 className="text-3xl font-bold mb-4 text-[#40513B]">Created Playlists</h2>
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : tracks.length > 0 ? (
                <div className="flex flex-col items-center">
                    <table className="table-auto mb-4 border-2 border-[#40513B] rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-2 border-[#40513B] rounded-tl-lg">Name</th>
                                <th className="px-4 py-2 border-2 border-[#40513B]">Artist</th>
                                <th className="px-4 py-2 border-2 border-[#40513B] rounded-tr-lg">Album</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tracks.map((track) => (
                                <tr key={track.id}>
                                    <td className="border-2 px-4 py-2 border-[#40513B]">{track.name}</td>
                                    <td className="border-2 px-4 py-2 border-[#40513B]">{track.artist}</td>
                                    <td className="border-2 px-4 py-2 border-[#40513B]">{track.album}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading playlists...</p>
            )}
        </div>
    );
};

export default DashboardPlaylist;