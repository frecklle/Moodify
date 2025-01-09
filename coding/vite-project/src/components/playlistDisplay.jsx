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



    const savePlaylist = async () => {
        try {
            const response = await fetch('http://localhost:5001/playlist/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlists, mood }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Playlist saved:', result);
        } catch (err) {
            console.error('Error saving playlist:', err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <h2 className="text-3xl font-bold mb-4 text-[#40513B]">Created Playlists</h2>
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : playlists.length > 0 ? (
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
                            {playlists.map((playlist) => (
                                <tr key={playlist.id}>
                                    <td className="border-2 px-4 py-2 border-[#40513B]">{playlist.name}</td>
                                    <td className="border-2 px-4 py-2 border-[#40513B]">{playlist.artist}</td>
                                    <td className="border-2 px-4 py-2 border-[#40513B]">{playlist.album}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={savePlaylist}
                        className="px-4 py-2 bg-[#609966] text-white rounded-md hover:bg-[#40513B] transition duration-300 ease-in-out"
                    >
                        Save Playlist
                    </button>
                </div>
            ) : (
                <p>Loading playlists...</p>
            )}
        </div>
    );
};

export default PlaylistDisplay;
