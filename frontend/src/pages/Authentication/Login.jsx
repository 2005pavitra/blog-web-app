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
  const [role, setRole] = useState("");
  const [adminPasskey, setAdminPasskey] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if admin role is selected and passkey is provided
    if (role === 'admin' && adminPasskey !== 'ADMIN123') {
      alert('Invalid admin passkey! Please contact the system administrator.');
      return;
    }
    
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        { email, password, role },
        { withCredentials: true }
      );
  
      console.log("Login Response:", response.data);
  
      if (response.data.token) {
        login(response.data.user, response.data.token); 
        console.log("Token Stored in Cookie");
  
        navigate("/allblogs");
      } else {
        console.error("No token received from backend!");
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
        <select
          className="border text-black p-2 w-full mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        {role === 'admin' && (
          <input
            type="password"
            placeholder="Admin Passkey"
            className="border text-black p-2 w-full mb-4"
            value={adminPasskey}
            onChange={(e) => setAdminPasskey(e.target.value)}
            required
          />
        )}
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
