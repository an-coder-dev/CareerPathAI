import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return toast.error('❌ All fields are required');
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5001/auth/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("✔️ Login successful! Redirecting...");
                localStorage.setItem('token', data.token);
                setIsAuthenticated(true);
                navigate('/home'); // ✅ Redirecting to Home Page
            } else {
                toast.error(data.message || "Invalid Credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("❌ Server Error. Try again later");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <ToastContainer />
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
};

export default Login;
