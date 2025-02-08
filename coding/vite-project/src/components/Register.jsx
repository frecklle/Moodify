import React, { useState } from "react";

function Register({ setIsRegistered }) {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    surname,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setError("");
                setIsRegistered(true);

                // Redirect after 0.5s delay
                setTimeout(() => {
                    window.location.href = "/login";
                }, 800);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to register');
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('Failed to register');
            setSuccess(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B] w-screen">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center text-[#40513B] mb-6">Create Your Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Surname:</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#609966]"
                                placeholder="Enter your surname"
                            />
                        </div>
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
                            Register
                        </button>
                        {error && (
                            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-500 text-sm text-center mt-4">
                                Successfully registered! Redirecting...
                            </p>
                        )}
                    </form>
                </div>
                <div className="bg-[#40513B] p-6 text-center">
                    <p className="text-white text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="font-semibold text-[#EDF1D6] hover:underline">
                            Log in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
