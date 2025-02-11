import React, { useState } from 'react';
import EmailChangeModal from './emailChangeModal';
import PasswordChangeModal from './PasswordChangeModal';

const Settings = () => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const userId = localStorage.getItem("userId");

    const handleChangeEmail = () => {
        if (!userId) {
            setMessage("You must be logged in to change your email.");
            return;
        }
        setIsEmailModalOpen(true);
    };

    const handleChangePassword = () => {
        if (!userId) {
            setMessage("You must be logged in to change your password.");
            return;
        }
        setIsPasswordModalOpen(true);
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("Are you sure you want to delete your account?");
        if (confirmation) {
            // Replace with actual backend logic to delete the account
            setMessage('Account deleted!');
        }
    };

    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#609966]">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>

                {error && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl text-center">
                            <h3 className="text-xl font-bold text-red-500 mb-4">Error: {error}</h3>
                            <p className="mb-4">Please try again</p>
                            <button
                                onClick={() => (window.location.search = '')}
                                className="bg-gradient-to-r from-green-700 to-green-600 text-white py-2 px-6 rounded-full hover:from-green-800 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col space-y-6">
                    <button
                        onClick={handleChangeEmail}
                        className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Change Email
                    </button>
                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
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
