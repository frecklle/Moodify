import React, { useState } from 'react';
import EmailChangeModal from './emailChangeModal'; // Make sure to import the modal component
import PasswordChangeModal from './PasswordChangeModal'; // Import the PasswordChangeModal component

const Settings = () => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // State to control password change modal

    const userId = localStorage.getItem("userId");

    const handleChangeEmail = () => {
        if (!userId) {
            alert("You must be logged in to change your email.");
            return;
        }
        setIsEmailModalOpen(true); // Open the email change modal
    };

    const handleChangePassword = () => {
        if (!userId) {
            alert("You must be logged in to change your password.");
            return;
        }
        setIsPasswordModalOpen(true); // Open the password change modal
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

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <div className="w-full max-w-sm bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-black mb-6">Settings</h2>
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
            {/* Email Change Modal */}
            <EmailChangeModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} userId={userId} />
            {/* Password Change Modal */}
            <PasswordChangeModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} userId={userId} />
        </div>
    );
};

export default Settings;
