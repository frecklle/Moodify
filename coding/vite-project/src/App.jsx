import React, { useEffect, useState } from 'react';
import Navbar from "./components/navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/login.jsx";
import Home from "./components/home.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check for token when the app loads
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <>
            <Router>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
