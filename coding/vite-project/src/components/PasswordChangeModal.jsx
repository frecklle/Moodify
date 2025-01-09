import React, { useState } from 'react';

const PasswordChangeModal = ({ isOpen, onClose, userId }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        setError('');
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields must be filled!");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Ensure the userId is passed to the modal correctly
        if (!userId) {
            setError("User not logged in. Please log in again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password successfully changed');
                onClose(); // Close the modal after success
            } else {
                setError(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.message || 'Something went wrong');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold text-black mb-4">Change Password</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-1">Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

export default PasswordChangeModal;
