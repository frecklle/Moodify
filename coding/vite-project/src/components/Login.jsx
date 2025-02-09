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
                    setUserId(data.userId);
                }

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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] w-screen">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center text-[#40513B] mb-6">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="off"
                                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#609966] text-white py-3 rounded-lg font-semibold hover:bg-[#40513B] transition-all duration-300 transform hover:scale-105"
                        >
                            Login
                        </button>
                        {error && (
                            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-500 text-sm text-center mt-4">
                                Login successful! Redirecting...
                            </p>
                        )}
                    </form>
                </div>
                <div className="bg-[#40513B] p-6 text-center">
                    <p className="text-white text-sm">
                        Don't have an account?{" "}
                        <a href="/register" className="font-semibold text-[#EDF1D6] hover:underline">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
