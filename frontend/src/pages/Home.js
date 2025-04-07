import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaSignOutAlt, FaCamera, FaSearch } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import CareerCards from './CareerCards';
import './Home.css';
import logo from "../assets/logo.png"


const Home = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState('');
    const [careerPaths, setCareerPaths] = useState([]);
    const [trendingTech, setTrendingTech] = useState([]);
    const [careerTips, setCareerTips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    

    const navigate = useNavigate();
    const redirectTriggered = useRef(false);
    
    const fetchNotifications = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/notifications", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include" // Ensures cookies & authentication tokens are sent
            });
    
            const data = await response.json();
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                if (!redirectTriggered.current) {
                    redirectTriggered.current = true;
                    handleError('You must log in first!');
                    navigate('/login');
                }
                return;
            }

            try {
                const response = await fetch("http://localhost:5001/auth/user", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

                const data = await response.json();
                setUser(data.user);
                setCareerPaths(data.user?.careerPaths || []);
                setProfileImage(data.user?.profileImage ? `http://localhost:5001/uploads/${data.user.profileImage}` : "https://via.placeholder.com/100");
            } catch (error) {
                console.error('Error fetching user data:', error);
                handleError('Error fetching user data. Please try again.');
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        setTrendingTech([
            "🔥 AI-Powered Resume Screening",
            "🚀 Blockchain in Career Verification",
            "🌎 Remote Work & AI Collaboration",
            "📊 Data Science in Business Strategy",
            "🛡️ Cybersecurity Job Trends",
        ]);

        setCareerTips([
            "✅ Keep updating your LinkedIn profile.",
            "📌 Learn Python for Data Science in 2025.",
            "🧑‍💻 Contribute to Open Source for better job opportunities.",
            "🚀 Build personal projects to showcase your skills.",
            "🎯 Master soft skills like communication & leadership.",
        ]);
    }, []);

    if (isLoading) return <div className="loading-screen">Loading...</div>;

    const handleLogout = () => {
        localStorage.clear();
        handleSuccess('User Logged Out');
        navigate('/login');
    };

    return (
        <div className="home-page">
            <img src={logo} alt="Skill.Dev Logo" className="navbar-logo" />
           <nav className="navbar">
                <h2 className="logo">AI Career Guidance</h2>
                <div className="nav-links">
                    <button className="nav-btn" onClick={() => navigate('/')}><FaHome /> Home</button>
                    <button className="nav-btn" onClick={() => navigate('/ProfilePage')}><FaUser /> Profile</button>
                    <button className="nav-btn" onClick={() => navigate('/Analyze')}><FaSearch /> Analyze</button>
                    
                    {/* Notifications Dropdown */}
                    <div className="notification-wrapper">
                        <button className="nav-btn" onClick={() => setShowNotifications(!showNotifications)}>
                            <FaBell /> Notifications {notifications.length > 0 && <span className="notif-count">{notifications.length}</span>}
                        </button>
                        {showNotifications && (
                            <div className="notification-dropdown">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className={`notif-item ${notif.type}`}>
                                            {notif.message}
                                        </div>
                                    ))
                                ) : (
                                    <div className="notif-item">No new notifications</div>
                                )}
                            </div>
                        )}
                    </div>
                    <button className="nav-btn logout" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                </div>
            </nav>

            <div className="welcome-message">
                <h2>Welcome, {user?.name || "User"}!</h2>
            </div>

            <div className="home-container">
                <div className="sidebar left-sidebar">
                    <div className="profile-card">
                        <label className="profile-image-upload">
                            <img src={profileImage} alt="Profile" className="profile-pic" />
                            <input type="file" accept="image/*" hidden />
                            <FaCamera className="camera-icon" />
                        </label>
                        <h3>{user?.name}</h3>
                        <p>{user?.bio || "Web Developer | Tech Enthusiast"}</p>
                        <button className="edit-profile" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
                    </div>
                    <div className="career-paths">
                        <h3>Career Paths</h3>
                        <ul>
                            {careerPaths.length > 0 ? careerPaths.map((path, index) => <li key={index}>{path}</li>) : <li>No career paths added yet.</li>}
                        </ul>
                    </div>
                </div>

                <div className="main-content">
                <div className="flex justify-center items-center">
      <div className="w-3/5 bg-white shadow-md rounded-lg p-4">
        {/* Dummy Post */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          {/* User Info */}
          <div className="flex items-center mb-2">
            <img
              src=""
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="text-md font-semibold">Alex!</h3>
              <p className="text-xs text-gray-500">Web Developer | AI Enthusiast</p>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-gray-700">
            Just finished an exciting project using AI and Machine Learning! 🚀
          </p>

          {/* Post Image */}
          <img
            src="https://via.placeholder.com/500x300"
            alt="Post"
            className="mt-2 rounded-lg shadow-md"
          />

          {/* Engagement Buttons */}
          <div className="flex justify-between mt-3 text-gray-600">
            <button className="hover:text-blue-500">👍 Like</button>
            <button className="hover:text-green-500">💬 Comment</button>
            <button className="hover:text-red-500">🔄 Share</button>
          </div>
        </div>
      </div>
    </div>
                </div>

                {/* Right Sidebar with Chatbot */}
                <div className="sidebar right-sidebar">
                    <div className="trending-tech">
                        <h3>🔥 Trending in Tech</h3>
                        <ul>
                            {trendingTech.map((tech, index) => <li key={index}>{tech}</li>)}
                        </ul>
                    </div>

                    <div className="career-tips">
                        <h3>💡 Career Tips</h3>
                        <ul>
                            {careerTips.map((tip, index) => <li key={index}>{tip}</li>)}
                        </ul>
                    </div>

                    {/* Chatbot Section */}
                    <div className="chatbot-container">
                        <h3>🤖 AI Career Chatbot</h3>
                        <iframe
                            src="https://www.chatbase.co/chatbot-iframe/ApxzC85iOJDpu9Uj0b7UQ"
                            width="100%"
                            style={{ height: "100%", minHeight: "300px", borderRadius: "10px", border: "1px solid #ccc" }}
                            frameBorder="0"
                        ></iframe>
                    </div>
                </div>
            </div>
  <ToastContainer />
        </div>
    );
};

export default Home;
