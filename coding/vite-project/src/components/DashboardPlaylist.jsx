import React, { useState, useEffect } from 'react';

const DashboardPlaylist = ({ userId, setIsLoggedIn, setUserId }) => {
    const queryParams = new URLSearchParams(window.location.search);
    const playlistId = queryParams.get('playlistId');
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:5001/dashboard/playlist?playlistId=${playlistId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTracks(data);
                console.log('Tracks:', data);
            } catch (err) {
                console.error('Error fetching playlists:', err);
                setError(err.message);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    const handleEdit = async () => {
        if (!newName) {
            alert('Playlist name cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/dashboard/playlist/edit?playlistId=${playlistId}&newName=${encodeURIComponent(newName)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Edit response:', data);
            setIsEditing(false); // Hide the input field after saving
            // Handle the response data as needed
        } catch (err) {
            console.error('Error editing playlist:', err);
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5001/dashboard/playlist/delete?playlistId=${playlistId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Delete response:', data);
            window.location.href = `http://localhost:5173/dashboard?userId=${userId}`;
        } catch (err) {
            console.error('Error deleting playlist:', err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <h2 className="text-3xl font-bold mb-4 text-[#40513B]">Created Playlists</h2>
            {tracks.length > 0 && (
                <div className="mb-4">
                    {isEditing && (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new playlist name"
                            className="px-4 py-2 border rounded mr-2"
                        />
                    )}
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Edit</button>
                    <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Save</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                </div>
            )}
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