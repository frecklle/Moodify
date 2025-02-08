import React, {useEffect, useState} from 'react';

const Home = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [spotifyConnected, setSpotifyConnected] = useState(false);

    useEffect(() => {
        const checkSpotifyConnection = async () => {
            try {
                const response = await fetch("http://localhost:5001/spotify/status");
                const data = await response.json();
                setSpotifyConnected(data.connected);
            } catch (error) {
                console.error("Error checking Spotify connection:", error);
            }
        };

        checkSpotifyConnection();
    }, []);

    const moods = [
        { emoji: '😀', label: 'Happy' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '😢', label: 'Sad' },
        { emoji: '😡', label: 'Angry' },
        { emoji: '😎', label: 'Cool' },
        { emoji: '😴', label: 'Sleepy' },
    ];

    const handleMoodClick = (mood, e) => {
        e.stopPropagation(); // Prevents event issues
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in to select a mood.");
            return;
        }
        console.log(`Mood selected: ${mood.label}`);
        setSelectedMood(mood);
    };

    const handleGeneratePlaylist = (mood) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in to generate a playlist.");
            return;
        }
        window.location.href = `http://localhost:5173/playlist/display?mood=${mood}`;
    };

    return (

        <div
            className="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] w-screen">
            {/* Header Section */}

            <div>
                {spotifyConnected ? (
                    <p className="text-green-600 font-semibold">✅ Connected to Spotify</p>
                ) : (
                    <p className="text-red-600 font-semibold">❌ Not Connected to Spotify</p>
                )}
            </div>


            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-[#40513B] mb-4 animate-fade-in">
                    Welcome to Moodify
                </h1>

                <h2 className="text-3xl text-[#609966] animate-fade-in-delay">
                    Select your mood:
                </h2>
            </div>

            {/* Mood Selection Section */}
            <div className="flex justify-center items-center flex-wrap gap-6 mb-8 animate-fade-in">
                {moods.map((mood) => (
                    <button
                        key={mood.label}
                        onClick={(e) => handleMoodClick(mood, e)}
                        className={`relative text-6xl transition-all transform hover:scale-125 focus:outline-none cursor-pointer ${
                            selectedMood?.label === mood.label ? 'scale-125' : 'scale-100'
                        }`}
                        style={{background: 'none', border: 'none', padding: '10px'}}
                    >
                        {mood.emoji}
                    </button>
                ))}
            </div>

            {/* Selected Mood Section */}
            {selectedMood && (
                <div className="mt-6 text-center animate-fade-in">
                    <h3 className="text-2xl text-[#609966] font-semibold">
                        Your selected mood: {selectedMood.emoji} ({selectedMood.label})
                    </h3>
                </div>
            )}

            {/* Generate Playlist Button */}
            {selectedMood && (
                <button
                    onClick={() => handleGeneratePlaylist(selectedMood.label.toLowerCase())}
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white text-xl font-semibold rounded-2xl hover:from-[#40513B] hover:to-[#609966] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    Generate Playlist
                </button>
            )}

            {/* Background Floating Elements */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                <div
                    className="animate-float w-24 h-24 bg-[#609966] opacity-20 rounded-full absolute top-1/4 left-1/4"></div>
                <div
                    className="animate-float-delay w-32 h-32 bg-[#40513B] opacity-20 rounded-full absolute bottom-1/4 right-1/4"></div>
            </div>
        </div>
    );
};

export default Home;
