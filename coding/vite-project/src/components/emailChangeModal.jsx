import React, { useState } from 'react';

const EmailChangeModal = ({ isOpen, onClose, userId }) => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [error, setError] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleConfirm = async () => {

        const userId = localStorage.getItem('userId');
        setError('');

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

            // Check if the response is OK
            if (!response.ok) {
                const errorData = await response.json(); // Attempt to parse error response as JSON
                throw new Error(errorData.message || "Something went wrong."); // Use a more generic message if parsing fails
            }

            const data = await response.json(); // Only parse as JSON if the response is OK
            alert(data.message); // Show success message
            onClose(); // Close modal after success
        } catch (error) {
            console.error('Error updating email:', error);
            setError(error.message || 'Failed to update email'); // Set error state with a meaningful message
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold text-black mb-4">Change Email</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Current Email:</label>
                    <input
                        type="email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">New Email:</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Confirm New Email:</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleConfirm}
                        className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailChangeModal;
