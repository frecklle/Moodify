import React from 'react';

const playlists = [
    { id: 1, name: 'Playlist 1', description: 'Description 1' },
    { id: 2, name: 'Playlist 2', description: 'Description 2' },
    { id: 3, name: 'Playlist 3', description: 'Description 3' },
];

const Dashboard = () => {
    return (
        <div>
            <h1>Playlists Dashboard</h1>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>
                        <h2>{playlist.name}</h2>
                        <p>{playlist.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;