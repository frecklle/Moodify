import React, { useState } from "react";

function Login({ setIsLoggedIn, setUserId }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setIsLoggedIn(true);

                if (data.userId) {
                    localStorage.setItem("userId", data.userId);
                    sessionStorage.setItem("userId", data.userId);
                    setUserId(data.userId);
                }
                sessionStorage.setItem("email", email);
                const token = btoa(JSON.stringify({ email }));
                localStorage.setItem("authToken", token);

                setTimeout(() => {
                    window.location.href = "/";
                }, 800);
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError("An error occurred during login. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#609966]">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800">
                        Login
                    </button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mt-4">Login successful! Redirecting...</p>}
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-700">Don't have an account?</p>
                    <button
                        onClick={() => window.location.href = "/register"}
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
