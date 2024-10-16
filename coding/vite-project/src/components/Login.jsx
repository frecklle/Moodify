import React, { useState } from "react";

function Login({ setIsLoggedIn, setUserId }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,  // Use the plain password, assuming it's encrypted for comparison on the server
                }),
            });

            const data = await response.json(); // Parse the response as JSON

            if (response.ok) {
                alert(data.message); // This should display "Login successful"
                const token = btoa(JSON.stringify({ email }));
                localStorage.setItem("authToken", token);
                localStorage.setItem("userId", data.userId);
                setIsLoggedIn(true); // Update state to reflect login status
                setUserId(data.userId);
                window.location.href = "/"; // Redirect to main page
            } else {
                alert(data.message); // This will display the error message from the server
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };


    // Function to handle redirection to registration page
    const handleRegisterRedirect = () => {
        window.location.href = "/register"; // Change this to the path of your registration page
    };

    return (
        <div className="flex justify-center items-center w-[100vw] min-h-screen bg-[#EDF1D6]">
            <div className="w-full max-w-sm bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-black">Login</h2>
                    <button
                        onClick={handleRegisterRedirect}
                        className="bg-green-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:scale-105"
                    >
                        Register
                    </button>
                </div>
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
                        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out hover:scale-105"
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
