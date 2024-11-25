import React, { useState } from 'react';

const Home = () => {
    const [selectedMood, setSelectedMood] = useState(null);

    const moods = [
        { emoji: '😀', label: 'Happy' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '😢', label: 'Sad' },
        { emoji: '😡', label: 'Angry' },
        { emoji: '😎', label: 'Cool' },
        { emoji: '😴', label: 'Sleepy' },
    ];

    const handleMoodClick = (mood) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in to select a mood.");
            return;
        }
        setSelectedMood(mood);
        console.log(`Mood set to: ${mood.label}`);
    };

    const handleGeneratePlaylist = (mood) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in to generate a playlist.");
            return;
        }
        window.location.href = `http://localhost:5001/spotify/playlist?mood=${mood}`;
    };

    return (
        <div className="flex flex-col text-black justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <h1 className="text-3xl font-bold mb-4 text-[#40513B]">Welcome to Moodify</h1>
            <h2 className="text-2xl mb-4 text-[#609966]">Select your mood:</h2>
            <div className="flex justify-center items-center flex-wrap space-x-4">
                {moods.map((mood) => (
                    <button
                        key={mood.label}
                        onClick={() => handleMoodClick(mood)}
                        className={`text-5xl transition-transform ${selectedMood === mood ? 'scale-100' : 'scale-100'} hover:scale-110 focus:outline-none`}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#40513B' }} // Adjust emoji color
                    >
                        {mood.emoji}
                    </button>
                ))}
                                        
            </div>
            {selectedMood && (
                <div className="mt-4">
                    <h3 className="text-xl text-[#609966]">Your selected mood: {selectedMood.emoji} ({selectedMood.label})</h3>
                </div>
            )}
            <button
                onClick={() => handleGeneratePlaylist('happy')}
                className="w-16 h-16 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out hover:scale-105"
            ></button>
        </div>
    );
};

export default Home;
