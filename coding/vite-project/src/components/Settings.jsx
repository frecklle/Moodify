import React, { useState } from 'react';
import EmailChangeModal from './EmailChangeModal'; // Make sure to import the modal component

const Settings = () => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const userId = localStorage.getItem("userId");

    const handleChangeEmail = () => {
            if (!userId) {
                alert("You must be logged in to change your email.");
                return;
            }
            setIsEmailModalOpen(true); // Open the modal when clicked
        };

    const handleChangePassword = () => {
        alert('Change Password option clicked!'); // Placeholder for opening password change popup
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("Are you sure you want to delete your account?");
        if (confirmation) {
            alert('Account deleted!'); // Placeholder for deleting account logic
        }
    };

    const handleSpotifyAuth = () => {
        const confirmation = window.confirm("This will redirect you to the Spotify authentication page. Are you sure you want to continue?");
        if (confirmation) {
            window.location.href = "http://localhost:5001/spotify/auth";
        }
    };
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <div className="w-full max-w-sm bg-white p-8 border border-gray-300 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-black mb-6">Settings</h2>
                
                {error && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h3 className="text-xl font-bold text-black-500 mb-4">Error: {error}</h3>
                            <p className="mb-4">Please try again</p>
                            <button
                                onClick={() => window.location.search = ''}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-400 transition duration-300 ease-in-out"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleChangeEmail}
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:scale-105"
                    >
                        Change Email
                    </button>
                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:scale-105"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={handleSpotifyAuth}
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:scale-105"
                    >
                        Connect to Spotify
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out hover:scale-105"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
            <EmailChangeModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} userId={userId} />
        </div>
    );
};

export default Settings;
