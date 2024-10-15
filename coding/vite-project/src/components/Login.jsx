import React, { useState } from "react";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform login logic (e.g., API call)
        const correctEmail = "student@example.com";
        const correctPassword = "password123";

        if (email === correctEmail && password === correctPassword) {
            const token = btoa(JSON.stringify({ email }));
            localStorage.setItem("authToken", token);
            setIsLoggedIn(true); // Update state to reflect login status
            window.location.href = "/"; // Redirect to main page
        } else {
            setError("Invalid email or password");
        }
        // Clear the form or redirect
    };

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <div className="w-full max-w-sm bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-black mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                        Login
                    </button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;
