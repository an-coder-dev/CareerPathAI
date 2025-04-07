import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";


const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFormData((prevState) => ({
                ...prevState,
                profilePicture: e.target.files[0],
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Form Validation
        if (
            !formData.fullName ||
            !formData.username ||
            !formData.email ||
            !formData.mobile ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("All fields are required!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("mobile", formData.mobile);
        formDataToSend.append("password", formData.password);
        if (formData.profilePicture) {
            formDataToSend.append("profilePicture", formData.profilePicture);
        }

        try {
            await axios.post(
                "http://localhost:5001/auth/signup",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setSuccessMessage("Signup successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed!");
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
