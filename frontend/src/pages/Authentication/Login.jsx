import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
  
      if (response.data.user) {
        login(response.data.user); 
        navigate("/allblogs");
      }
    } catch (err) {
      console.error("Login failed:", err?.response?.data?.message || err.message);
      alert(err?.response?.data?.message || "Invalid credentials!");
    }
  };
  
  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="border text-black p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border text-black p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button  className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">Login</button>
      </form>
      <div className="text-center">
        <p className="text-gray-600 mb-2">Don't have an account?</p>
        <Link to="/registration" className="text-blue-500 hover:text-blue-700 underline">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
