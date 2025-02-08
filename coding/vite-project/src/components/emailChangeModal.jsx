import React, { useState } from 'react';

const EmailChangeModal = ({ isOpen, onClose }) => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [error, setError] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleConfirm = async () => {
        const userId = localStorage.getItem('userId');  // Corrected this line
        console.log('Retrieved userId:', userId);
        setError('');

        if (!userId) {
            setError("User is not logged in. Please log in and try again.");
            return;
        }

        if (!currentEmail || !newEmail || !confirmEmail) {
            setError("All fields must be filled!");
            return;
        }

        if (!emailRegex.test(currentEmail) || !emailRegex.test(newEmail)) {
            setError("Please enter valid email addresses!");
            return;
        }

        if (newEmail !== confirmEmail) {
            setError("New emails do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/update-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, currentEmail, newEmail }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong.");
            }

            const data = await response.json();
            alert(data.message);
            onClose();
        } catch (error) {
            console.error('Error updating email:', error);
            setError(error.message || 'Failed to update email');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-500 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Change Email</h2>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Email:</label>
                    <input
                        type="email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your current email"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Email:</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your new email"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Email:</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Confirm your new email"
                        required
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-sm font-semibold mb-4 animate-pulse">
                        {error}
                    </p>
                )}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleConfirm}
                        className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailChangeModal;