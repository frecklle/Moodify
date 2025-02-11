import React, { useState } from 'react';

const EmailChangeModal = ({ isOpen, onClose }) => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevents multiple submissions

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleConfirm = async () => {
        const userId = localStorage.getItem('userId');
        console.log('Retrieved userId:', userId);
        setError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        if (!userId) {
            setError("User is not logged in. Please log in and try again.");
            setIsSubmitting(false);
            return;
        }

        if (!currentEmail || !newEmail || !confirmEmail) {
            setError("All fields must be filled!");
            setIsSubmitting(false);
            return;
        }

        if (!emailRegex.test(currentEmail) || !emailRegex.test(newEmail)) {
            setError("Please enter valid email addresses!");
            setIsSubmitting(false);
            return;
        }

        if (newEmail !== confirmEmail) {
            setError("New emails do not match!");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/update-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, currentEmail, newEmail }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong.");
            }

            const data = await response.json();
            setSuccessMessage(data.message); // Display success message
            setTimeout(onClose, 1000); // Close modal after 3 seconds
        } catch (error) {
            console.error('Error updating email:', error);
            setError(error.message || 'Failed to update email');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transition-all duration-500 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Change Email</h2>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Email:</label>
                    <input
                        type="email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        placeholder="Enter your current email"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Email:</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        placeholder="Enter your new email"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Email:</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        placeholder="Confirm your new email"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Error or Success Message */}
                {error && (
                    <p className="text-red-500 text-sm font-semibold mb-4 animate-pulse">
                        {error}
                    </p>
                )}
                {successMessage && (
                    <p className="text-green-500 text-sm font-semibold mb-4 animate-pulse">
                        {successMessage}
                    </p>
                )}

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleConfirm}
                        className={`px-6 py-3 rounded-lg text-white transition-all duration-300 transform shadow-lg ${
                            isSubmitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 hover:scale-105'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailChangeModal;
