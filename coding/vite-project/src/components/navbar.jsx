import React, { useState, useEffect } from 'react';
import navList from '../constants/navList.jsx';
import ProfileList from "../constants/ProfileList.jsx";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        if (userId) {
            // Fetch profile data from backend
            fetch(`http://localhost:5001/profile?userId=${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.profile_image) {
                        setProfileImage(data.profile_image); // Set the profile image URL if available
                    }
                })
                .catch(error => console.error('Error fetching profile image:', error));
        }
    }, [isLoggedIn, profileImage]); // Add profileImage as a dependency

    const handleDropDown = () => {
        setShowMenu(!showMenu);
        setShowProfileMenu(false);
    };

    const handleProfileDropDown = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowMenu(false);
    };

    const handleClick = (nav) => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

        if (nav === "Playlists") {
            window.location.href = `http://localhost:5173/dashboard?userId=${userId}`;
        } else if (nav === "Collaborate") {
            window.location.href = "/collaborate";
        }
    };

    const handleHomePage = () => {
        window.location.href = "/";
    };

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
            window.location.href = "login";
        } else {
            window.location.href = "/login";
        }
    };

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const handleSpotifyAuth = () => {
        const confirmation = window.confirm("This will redirect you to the Spotify authentication page. Are you sure you want to continue?");
        if (confirmation) {
            window.location.href = "http://localhost:5001/spotify/auth";
        }
    };

    return (
        <header className="w-screen fixed top-0 py-3 bg-gradient-to-r from-[#9DC08B] to-[#609966] shadow-lg z-50">
            <nav className="w-full flex justify-between items-center relative px-6">
                {/* Moodify Logo */}
                <div className="flex items-center">
                    <h1
                        onClick={handleHomePage}
                        className="text-2xl font-bold text-white cursor-pointer transition-transform hover:scale-105"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                        Moodify
                    </h1>
                </div>

                {/* Right Side Buttons and Dropdowns */}
                <div className="relative flex items-center space-x-4">
                    {/* Connect to Spotify Button */}
                    <button
                        onClick={handleSpotifyAuth}
                        className="px-6 py-2 bg-[#1DB954] text-white rounded-full hover:bg-[#1ED760] transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        Connect to Spotify
                    </button>

                    {/* Menu Button */}
                    <button
                        className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full hover:bg-opacity-30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        onClick={handleDropDown}
                    >
                        ☰
                    </button>

                    {/* Profile Button */}
                    <button
                        className="relative p-0 border-none bg-transparent rounded-full overflow-hidden focus:outline-none"
                        onClick={handleProfileDropDown}
                    >
                        {profileImage ? (
                            <img
                                src={`http://localhost:5001${profileImage}`} // Assuming your backend provides the full image URL
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full" // Circular shape for the image
                            />
                        ) : (
                            <img
                                src="https://via.placeholder.com/150" // Default placeholder image
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full" // Circular shape for the image
                            />
                        )}
                    </button>

                    {/* Dropdown Menu */}
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

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <div
                            className="absolute right-0 top-12 mt-2 bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] border border-[#40513B] rounded-2xl shadow-xl flex flex-col w-48 p-2 space-y-2">
                            {ProfileList.map((nav, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 text-[#40513B] bg-white bg-opacity-80 hover:bg-[#609966] hover:text-white rounded-xl shadow-md transition-all duration-200 ease-in-out"
                                    onClick={() => handleNavigation(nav.path)}
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
            </nav>
        </header>
    );
};

export default Navbar;
