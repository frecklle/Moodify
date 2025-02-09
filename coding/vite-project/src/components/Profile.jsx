import React, { useState, useEffect, useRef } from 'react';

const Profile = ({ userId }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150'); // Default placeholder image
    const fileInputRef = useRef(null);


    useEffect(() => {
        if (userId) {
            // Fetch profile data from the backend
            fetch(`http://localhost:5001/profile?userId=${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.username) setName(data.username);
                    if (data.bio) setBio(data.bio);
                    if (data.profile_image) setProfileImage(`http://localhost:5001${data.profile_image}`); // Set profile image URL
                })
                .catch(error => console.error('Error fetching profile:', error));
        }
    }, [userId]);

    const handleSave = () => {
        if (userId) {
            // Save profile data to the backend
            fetch('http://localhost:5001/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, username: name, bio }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Profile updated successfully') {
                        setMessage('Profile updated successfully!');
                    } else {
                        setMessage(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error updating profile:', error);
                    setMessage('An error occurred while updating the profile.');
                });
        } else {
            setMessage('User ID is required to save profile data.');
        }
    };

    const handlePicture = (file) => {
        if (file && userId) {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('file', file);

            // Send the file to the backend
            fetch('http://localhost:5001/profile/upload', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Profile picture uploaded successfully!') {
                        setMessage('Profile picture updated successfully!');
                        // Update profile image URL only after successful upload
                        setProfileImage(`http://localhost:5001${data.imageUrl}`);
                    } else {
                        setMessage(data.message || 'Profile picture uploaded successfully!');
                    }
                })
                .catch(error => {
                    console.error('Error uploading profile picture:', error);
                    setMessage('An error occurred while uploading the profile picture.');
                });
        } else {
            setMessage('Please select a file first.');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Delay file upload until after file is selected
            setMessage('Uploading image...');
            // Only upload the image after the user selects it
            setTimeout(() => handlePicture(selectedFile), 1000);
        }
    };

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                        <img
                            key={profileImage}  // Force re-rendering when profileImage changes
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}  // Fallback image
                        />
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    {/* Button to trigger file input */}
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-1 px-1 rounded-lg text-sm font-semibold hover:from-green-800 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-80 shadow-lg w-1/3"
                    >
                        Edit Profile Picture
                    </button>

                    <h2 className="pt-4 text-3xl font-bold text-gray-800 mb-2">Profile</h2>
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

                {/* Message Section */}
                {message && (
                    <div className="mt-4 text-center text-gray-700 font-semibold">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
