import React, { useState } from 'react'
import Button from '@mui/material/Button';

function Registration() {

    const [formdata, setformdata] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdata({
            ...formdata,
            [name]: value
        });
    };

    const registerUser = async (userData) => {
        try {
            const response = await fetch('http://localhost:4000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Error while registering');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser(formdata);
            console.log("Registration successful:", data);
        } catch (error) {
            console.log("Error while registering:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                    Name:
                </label>
                <input
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email:
                </label>
                <input
                    type="email"
                    name="email"
                    value={formdata.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                    Password:
                </label>
                <input
                    type="password"
                    name="password"
                    value={formdata.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                    Phone:
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formdata.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
                    Role:
                </label>
                <select
                    name="role"
                    value={formdata.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <Button
                variant="outlined"  // Updated to use outlined style
                type="submit"  // Changed to 'submit' for correct form submission
                className="w-full text-black font-semibold py-2 px-4 rounded-md hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Register
            </Button>
        </form>
    );
}

export default Registration;
