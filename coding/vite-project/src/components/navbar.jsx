import React, { useState } from 'react';
import navList from '../constants/navList.jsx';
import ProfileList from "../constants/ProfileList.jsx";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleDropDown = () => {
        setShowMenu(!showMenu);
        setShowProfileMenu(false);
    };

    const handleProfileDropDown = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowMenu(false);
    };

    const handleClick = () => {
        alert("Button clicked!");
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
        window.location.href = path; // Navigate to the provided path
    };

    return (
        <header className="w-full fixed top-0 py-1 bg-[#9DC08B]">
            <nav className="w-full flex justify-between items-center relative pr-2">
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="border border-[#40513B] rounded-full py-1 px-4 flex items-center bg-green-700">
                        <h1
                            onClick={handleHomePage}
                            className="text-xl font-bold text-white cursor-pointer"
                            style={{fontFamily: 'Montserrat, sans-serif'}}
                        >
                            Moodify
                        </h1>
                    </div>
                </div>

                <div className="relative flex items-center ml-auto">
                    <button
                        className="mx-3 px-4 py-2 bg-[#EDF1D6] text-black rounded-full hover:bg-[#9DC08B] focus:outline-none focus:ring-2 focus:ring-[#609966] focus:ring-opacity-100"
                        onClick={handleDropDown}
                    >
                        ☰
                    </button>

                    <button
                        className="px-3 py-2 bg-[#EDF1D6] text-black rounded-full hover:bg-[#9DC08B] focus:outline-none focus:ring-2 focus:ring-[#609966] focus:ring-opacity-100"
                        onClick={handleProfileDropDown}
                    >
                        🙎🏻‍♂️
                    </button>

                {showMenu && (
                    <div
                        className="absolute right-0 top-10 mt-2 bg-[#EDF1D6] border border-gray-300 rounded shadow-lg flex flex-col w-40 max-w-xs">
                        {navList.map((nav, index) => (
                            <button
                                key={index}
                                className="px-2 mt-0.5 mb-0.5 py-1 text-black bg-[#9DC08B] hover:bg-[#609966]"
                                onClick={handleClick}
                            >
                                {nav}
                            </button>
                        ))}
                    </div>
                )}

                {showProfileMenu && (
                    <div
                        className="absolute right-0 top-10 mt-2 bg-[#EDF1D6] border border-gray-300 rounded shadow-lg flex flex-col w-40 max-w-xs">
                        {ProfileList.map((nav, index) => (
                            <button
                                key={index}
                                className="px-2 mt-0.5 mb-0.5 py-1 text-black bg-[#9DC08B] hover:bg-[#609966]"
                                onClick={() => handleNavigation(nav.path)}
                            >
                                {nav.name}
                            </button>
                        ))}
                        <button
                            className="px-2 mt-0.5 mb-0.5 py-1 text-black bg-[#9DC08B] hover:bg-[#609966]"
                            onClick={handleLoginLogout}
                        >
                            {isLoggedIn ? 'Log Out' : 'Log In'}
                        </button>
                    </div>
                )}
            </div>
        </nav>
</header>
)
    ;
};

export default Navbar;
