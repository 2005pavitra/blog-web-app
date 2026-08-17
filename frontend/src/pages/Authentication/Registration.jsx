import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider';

function Registration() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [formdata, setformdata] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdata({
            ...formdata,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, formdata, {
                withCredentials: true
            });
            setSuccessMsg("User registered successfully! Redirecting...");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error("Error while registering:", error.response?.data || error.message);
            setErrorMsg(error.response?.data?.message || "Registration failed!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Left Panel */}
            <div className="md:w-1/2 bg-slate-900 text-white flex flex-col justify-center items-center p-12 relative overflow-hidden hidden md:flex">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-50 z-0"></div>
                <div className="z-10 text-center max-w-md">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">Join BlogSpace</h1>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Become part of our growing community of readers and writers. Share your voice today.
                    </p>
                    <div className="mt-12 flex space-x-4 justify-center">
                        <div className="w-4 h-1 bg-slate-600 rounded-full"></div>
                        <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
                        <div className="w-4 h-1 bg-slate-600 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className={`w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 shadow-xl md:shadow-none z-10 transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-8">
                        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Create an account</h2>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Sign up to get started.</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
                            <div className="flex">
                                <span className="mr-2">⚠️</span>
                                <p className="text-sm font-medium">{errorMsg}</p>
                            </div>
                        </div>
                    )}
                    
                    {successMsg && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md">
                            <div className="flex">
                                <span className="mr-2">✅</span>
                                <p className="text-sm font-medium">{successMsg}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Full Name</label>
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>👤</span>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formdata.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:bg-slate-700' : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-900'}`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</label>
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>✉️</span>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formdata.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:bg-slate-700' : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-900'}`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Password</label>
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formdata.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:bg-slate-700' : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-900'}`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Phone Number</label>
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>📞</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formdata.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:bg-slate-700' : 'border-slate-200 bg-slate-50 focus:bg-white text-slate-900'}`}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <span>Register</span>
                            )}
                        </button>
                    </form>

                    <div className={`mt-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Already Registered?{' '}
                        <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                            Login now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;
