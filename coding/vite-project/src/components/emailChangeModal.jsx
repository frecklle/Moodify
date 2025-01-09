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
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Change Email</h2>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Current Email:</label>
                    <input
                        type="email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">New Email:</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-1">Confirm New Email:</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleConfirm}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailChangeModal;
