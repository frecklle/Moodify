import React, { useState, useEffect } from 'react';
import navList from '../constants/navList.jsx';
import ProfileList from "../constants/ProfileList.jsx";
import defaultProfilePic from '../constants/moodify_default.jpg'; // Import the default profile picture

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profileImage, setProfileImage] = useState(defaultProfilePic); // Set default profile picture
    const [showLoginMessage, setShowLoginMessage] = useState(false); // State for login message

    const fetchProfileImage = () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setProfileImage(defaultProfilePic); // Ensure default image is used for non-logged-in users
            return;
        }

        fetch(`http://localhost:5001/profile?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.profile_image) {
                    setProfileImage(`http://localhost:5001${data.profile_image}`);
                } else {
                    setProfileImage(defaultProfilePic); // Fallback if no profile image is found
                }
            })
            .catch(error => {
                console.error('Error fetching profile image:', error);
                setProfileImage(defaultProfilePic); // Ensure fallback in case of error
            });
    };

    useEffect(() => {
        fetchProfileImage();
    }, [isLoggedIn]);

    const handleDropDown = () => {
        setShowMenu(!showMenu);
        setShowProfileMenu(false);
    };

    const handleProfileDropDown = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowMenu(false);
    };

    const handleClick = (nav) => {
        const userId = localStorage.getItem('userId');

        if (!isLoggedIn) {
            // Redirect to login page for other buttons
            if (nav !== "Connect to Spotify") {
                window.location.href = "/login"; // Redirect to login without showing the message
            }
            return;
        }

        // Handle specific nav actions when logged in
        switch (nav) {
            case "Playlists":
                window.location.href = '/dashboard?userId=${userId}';
                break;
            case "Profile":
                window.location.href = "/profile";
                break;
            case "Settings":
                window.location.href = "/settings";
                break;
            default:
                break;
        }
    };

    const handleHomePage = () => {
        window.location.href = "/";
    };

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId"); // Also remove userId to prevent fetching an old profile
            setProfileImage(defaultProfilePic); // Reset profile image to default
            setIsLoggedIn(false);
            window.location.href = "/login";
        } else {
            window.location.href = "/login";
        }
    };

    const handleSpotifyAuth = () => {
        if (!isLoggedIn) {
            setShowLoginMessage(true); // Show message to log in
            setTimeout(() => setShowLoginMessage(false), 3000); // Hide message after 3 seconds
            return;
        }

        const confirmation = window.confirm("This will redirect you to the Spotify authentication page. Are you sure you want to continue?");
        if (confirmation) {
            const email = sessionStorage.getItem('email');
            window.location.href = `http://localhost:5001/spotify/auth?email=${email}`;
        }
    };

    return (
        <header className="w-screen fixed top-0 py-3 bg-gradient-to-r from-[#9DC08B] to-[#609966] shadow-lg z-50">
            <nav className="w-full flex justify-between items-center relative px-6">
                <div className="flex items-center">
                    <h1
                        onClick={handleHomePage}
                        className="text-2xl font-bold text-white cursor-pointer transition-transform hover:scale-105"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        Moodify
                    </h1>
                </div>

                <div className="relative flex items-center space-x-4">
                    <button
                        onClick={handleSpotifyAuth}
                        className="px-6 py-2 bg-[#1DB954] text-white rounded-full hover:bg-[#1ED760] transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        Connect to Spotify
                    </button>

                    <button
                        className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full hover:bg-opacity-30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        onClick={handleDropDown}
                    >
                        ☰
                    </button>

                    <button
                        className="relative p-0 border-none bg-transparent rounded-full overflow-hidden focus:outline-none"
                        onClick={handleProfileDropDown}
                    >
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-10 h-10 object-cover rounded-full"
                        />
                    </button>

                    {showMenu && (
                        <div
                            className="absolute right-0 top-12 mt-2 bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] border border-[#40513B] rounded-2xl shadow-xl flex flex-col w-48 p-2 space-y-2">
                            {navList.map((nav, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 text-[#40513B] bg-white bg-opacity-80 hover:bg-[#609966] hover:text-white rounded-xl shadow-md transition-all duration-200 ease-in-out"
                                    onClick={() => handleClick(nav)}
                                >
                                    {nav}
                                </button>
                            ))}
                        </div>
                    )}

                    {showProfileMenu && (
                        <div
                            className="absolute right-0 top-12 mt-2 bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] border border-[#40513B] rounded-2xl shadow-xl flex flex-col w-48 p-2 space-y-2">
                            {ProfileList.map((nav, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 text-[#40513B] bg-white bg-opacity-80 hover:bg-[#609966] hover:text-white rounded-xl shadow-md transition-all duration-200 ease-in-out"
                                    onClick={() => handleClick(nav.name)} // Use handleClick for navigation
                                >
                                    {nav.name}
                                </button>
                            ))}
                            <button
                                className="px-4 py-2 text-[#40513B] bg-white bg-opacity-80 hover:bg-[#609966] hover:text-white rounded-xl shadow-md transition-all duration-200 ease-in-out"
                                onClick={handleLoginLogout}
                            >
                                {isLoggedIn ? 'Log Out' : 'Log In'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Display login message if the user tries to interact without logging in */}
                {showLoginMessage && (
                    <div
                        className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg shadow-xl z-50">
                        <p>Please log in first to continue.</p>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
