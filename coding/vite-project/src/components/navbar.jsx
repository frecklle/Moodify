import React, { useState } from 'react';
import navList from '../constants/navList.jsx';
import ProfileList from "../constants/ProfileList.jsx";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleDropDown = () => {
        setShowMenu(!showMenu);
    };

    const handleProfileDropDown = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleClick = () => {
        alert("Button clicked!");
    };

    const handleHomePage = () => {
        window.location.href = "/";
    }

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            localStorage.removeItem("authToken");
            setIsLoggedIn(false); // Update the parent state
            window.location.href = "login"
        } else {
            window.location.href = "/login"; // Redirect to login
        }
    };

    return (
        <header className="w-full fixed top-0 py-1 bg-gray-400">
            <nav className="w-full flex justify-between items-center relative pr-2">
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="border border-green-700 rounded-full py-1 px-4 flex items-center bg-green-700">
                        <h1
                            onClick={handleHomePage}
                            className="text-xl font-bold text-black cursor-pointer"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Moodify
                        </h1>
                    </div>
                </div>

                <div className="relative flex items-center ml-auto">
                    <button
                        className="mx-3 px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800"
                        onClick={handleDropDown}
                    >
                        ☰
                    </button>

                    <button
                        className="px-3 py-2 bg-gray-100 text-black rounded-full hover:bg-gray-800"
                        onClick={handleProfileDropDown}
                    >
                        🙎🏻‍♂️
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-10 mt-2 bg-gray-400 border border-gray-300 rounded shadow-lg flex flex-col w-40 max-w-xs">
                            {navList.map((nav, index) => (
                                <button
                                    key={index}
                                    className="px-2 mt-0.5 mb-0.5 py-1 text-white bg-gray-700 hover:bg-gray-200"
                                    onClick={handleClick}
                                >
                                    {nav}
                                </button>
                            ))}
                        </div>
                    )}

                    {showProfileMenu && (
                        <div className="absolute right-0 top-10 mt-2 bg-gray-400 border border-gray-300 rounded shadow-lg flex flex-col w-40 max-w-xs">
                            {ProfileList.map((nav, index) => (
                                <button
                                    key={index}
                                    className="px-2 mt-0.5 mb-0.5 py-1 text-white bg-gray-700 hover:bg-gray-200"
                                    onClick={handleClick}
                                >
                                    {nav}
                                </button>
                            ))}
                            <button
                                className="px-2 mt-0.5 mb-0.5 py-1 text-white bg-gray-700 hover:bg-gray-200"
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
