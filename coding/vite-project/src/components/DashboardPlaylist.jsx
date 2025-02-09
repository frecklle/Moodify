import React, { useState, useEffect } from 'react';

const DashboardPlaylist = ({ userId, setIsLoggedIn, setUserId }) => {
    const queryParams = new URLSearchParams(window.location.search);
    const playlistId = queryParams.get('playlistId');
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [name, setName] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:5001/dashboard/playlist?playlistId=${playlistId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTracks(data.tracks);
                setName(data.playlistName);
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
            setName(newName); // Update the displayed name
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

    const handleGenerateLink = async () => {
        try {
            const response = await fetch(`http://localhost:5001/dashboard/playlist/link?playlistId=${playlistId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Generated link:', data.link);
            setGeneratedLink(data.link);
        } catch (err) {
            console.error('Error generating link:', err);
            setError(err.message);
        }
    };

    const handleSearch = async (query) => {
        try {
            const response = await fetch(`http://localhost:5001/dashboard/playlist/search?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            console.error('Error searching for tracks:', err);
            setError(err.message);
        }
    };

    const handleAddTrack = async (trackId) => {
        try {
            const response = await fetch(`http://localhost:5001/dashboard/playlist/add?playlistId=${playlistId}&trackId=${trackId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Add track response:', data);
            setTracks((prevTracks) => [...prevTracks, data.track]);
        } catch (err) {
            console.error('Error adding track:', err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] p-6 pt-24"> {/* Add pt-24 to offset the header */}
            {/* Header */}
            <h2 className="text-4xl font-bold mb-8 text-[#40513B] animate-fade-in">
                {name || "Playlist Details"}
            </h2>

            {/* Playlist Actions */}
            <div className="flex flex-wrap text-black gap-4 mb-8">
                {isEditing ? (
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new playlist name"
                            className="px-4 py-2 border bg-white border-[#40513B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#609966]"
                        />
                        <button
                            onClick={handleEdit}
                            className="px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl hover:from-[#40513B] hover:to-[#609966] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-black px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl hover:from-[#40513B] hover:to-[#609966] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Edit Name
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    Delete Playlist
                </button>
            </div>

            {/* Search Section */}
            <div className="w-full text-black max-w-4xl mb-8">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(searchQuery);
                            }
                        }}
                        placeholder="Search for tracks"
                        className=" bg-white text-black w-full px-4 py-2 border border-[#40513B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                    <button
                        onClick={() => handleSearch(searchQuery)}
                        className="px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl hover:from-[#40513B] hover:to-[#609966] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Search
                    </button>
                    {isSearching && (
                        <button
                            onClick={() => setIsSearching(false)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Hide Search
                        </button>
                    )}
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-4 text-[#40513B]">Search Results</h3>
                        <ul className="space-y-4">
                            {searchResults.map((track) => (
                                <li key={track.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                                    <div>
                                        <p className="text-lg font-semibold text-[#40513B]">{track.name}</p>
                                        <p className="text-sm text-gray-600">{track.artist} - {track.album}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddTrack(track.id)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl hover:from-[#40513B] hover:to-[#609966] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Tracks List */}
            {tracks.length > 0 ? (
                <div className="w-full max-w-4xl h-96 overflow-y-auto bg-white rounded-xl p-4 shadow-lg">
                    <h3 className="text-2xl font-bold mb-6 text-[#40513B]">Tracks</h3>
                    <ul className="space-y-4">
                        {tracks.map((track) => (
                            <li key={track.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                                <div>
                                    <p className="text-lg font-semibold text-[#40513B]">{track.name}</p>
                                    <p className="text-sm text-gray-600">{track.artist} - {track.album}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-[#40513B] text-lg">No tracks found in this playlist.</p>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-lg mt-6">{error}</p>
            )}

            {/* Generate Link Button at the Bottom */}
            <div className="w-full flex justify-center mt-8">
                <button
                    onClick={handleGenerateLink}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    Generate Link
                </button>
            </div>
            {generatedLink && (
                <p className="text-blue-500 mt-2 text-center">
                    Generated Link: <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="underline">{generatedLink}</a>
                </p>
            )}
        </div>
    );
};

export default DashboardPlaylist;
