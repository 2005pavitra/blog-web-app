import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Registration() {
    const [formdata, setformdata] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user' // Default role set to 'user'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdata({
            ...formdata,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/users/register", formdata);
            console.log(response.data);
            alert('User registered successfully!');
        } catch (error) {
            console.error("Error while registering:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Registration failed!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formdata.email}
                    onChange={handleChange}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formdata.password}
                    onChange={handleChange}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">Phone:</label>
                <input
                    type="tel"
                    name="phone"
                    value={formdata.phone}
                    onChange={handleChange}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">Role:</label>
                <select
                    name="role"
                    value={formdata.role}
                    onChange={handleChange}
                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <Button
                variant="contained"
                type="submit"
                className="w-full text-white bg-blue-500 font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Register
            </Button>
            <p className="text-black text-center mt-4">
                Already Registered? <Link to="/login" className="text-blue-500">Login now</Link>
            </p>
        </form>
    );
}

export default Registration;
