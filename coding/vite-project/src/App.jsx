import React, { useEffect, useState } from 'react';
import Navbar from "./components/navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/login.jsx";
import Home from "./components/home.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";
import Settings from "./components/Settings.jsx";
import PlaylistDisplay from "./components/PlaylistDisplay.jsx";
import Dashboard from './components/Dashboard.jsx';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null); // Add userId state

    // Check for token and user ID when the app loads
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const id = localStorage.getItem("userId"); // Assuming you store user ID in localStorage
        if (token) {
            setIsLoggedIn(true);
            setUserId(id); // Set user ID
        }
    }, []);

    return (
        <>
            <Router>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/playlist/display" element={<PlaylistDisplay setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
                    <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
                    <Route path="/register" element={<Register setIsRegistered={setIsLoggedIn} />} />
                    <Route path="/profile" element={isLoggedIn ? <Profile userId={userId} /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/settings" element={isLoggedIn ? <Settings userId={userId} /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
