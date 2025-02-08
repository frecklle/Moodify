import React, { useState } from 'react';

const Profile = () => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [bio, setBio] = useState('This is my bio.');

    const handleSave = () => {
        // Simulate saving data to the server
        console.log('Profile updated:', {name, email, bio});
        alert('Profile updated successfully!');
    };

    return (
        <div
            className="flex justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]">
            <div
                className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                        <img
                            src="https://via.placeholder.com/150" // Replace with user's profile picture
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile</h2>
                    <p className="text-sm text-gray-600">Edit your profile information</p>
                </div>

                {/* Username Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your username"
                    />
                </div>

                {/* Bio Field */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio:</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        rows="4"
                        placeholder="Tell us about yourself..."
                    ></textarea>
                </div>

                {/* Save Changes Button */}
                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-800 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Profile;
