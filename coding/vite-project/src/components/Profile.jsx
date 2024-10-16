import React, { useState } from 'react';

const Profile = () => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [bio, setBio] = useState('This is my bio.');

    const handleSave = () => {
        // Simulate saving data to the server
        console.log('Profile updated:', { name, email, bio });
        alert('Profile updated successfully!');
    };

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <div className="w-full max-w-sm bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-black mb-6">Profile</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">username:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded p-2 w-full text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Bio:</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="border rounded p-2 w-full text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    ></textarea>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Profile;
