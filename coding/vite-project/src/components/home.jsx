import React, { useState } from 'react';

const Home = () => {
    // State to hold the selected mood
    const [selectedMood, setSelectedMood] = useState(null);

    // Mood emojis
    const moods = [
        { emoji: '😀', label: 'Happy' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '😢', label: 'Sad' },
        { emoji: '😡', label: 'Angry' },
        { emoji: '😎', label: 'Cool' },
        { emoji: '😴', label: 'Sleepy' },
    ];

    const handleMoodClick = (mood) => {
        // Check if the token exists
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in to select a mood."); // Prompt the user to log in
            return; // Exit the function if no token is found
        }

        setSelectedMood(mood);
        console.log(`Mood set to: ${mood.label}`);
    };

    return (
        <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-gray-700">
            <h1 className="text-3xl font-bold mb-4">Welcome to Moodify</h1>
            <h2 className="text-2xl mb-4">Select your mood:</h2>
            <div className="flex justify-center items-center flex-wrap space-x-4">
                {moods.map((mood) => (
                    <button
                        key={mood.label}
                        onClick={() => handleMoodClick(mood)}
                        className={`text-5xl transition-transform ${selectedMood === mood ? 'scale-100' : 'scale-100'} hover:scale-110 focus:outline-none`}
                        style={{ background: 'none', border: 'none', padding: 0 }} // Remove background and border
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>
            {selectedMood && (
                <div className="mt-4">
                    <h3 className="text-xl">Your selected mood: {selectedMood.emoji} ({selectedMood.label})</h3>
                </div>
            )}
        </div>
    );
};

export default Home;
