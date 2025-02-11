import React from 'react';

const FeedbackMessage = ({ message, type }) => {
    if (!message) return null;

    const messageTypeClass = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 ${messageTypeClass} text-white p-3 rounded-lg shadow-xl z-50`}>
            <p>{message}</p>
        </div>
    );
};

export default FeedbackMessage;


