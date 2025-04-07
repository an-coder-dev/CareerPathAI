import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProfile = async () => {
          const username = localStorage.getItem("username");
  
          if (!username) {
              navigate("/login");
              return;
          }
  
          try {
              const response = await fetch(`http://localhost:5001/api/profile/${username}`);
              const data = await response.json();
              console.log("Fetched Profile Data:", data); // Debugging line
  
              if (response.ok) {
                  setProfile(data);
              } else {
                  setError(data.message || "Profile not found.");
              }
          } catch (error) {
              setError("Error fetching profile. Please try again.");
              console.error("Error fetching profile:", error);
          }
      };
  
      fetchProfile();
  }, [navigate]);
  

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <h2>{profile.name}</h2>
            <p>Email: {profile.email}</p>
            <p>Mobile: {profile.mobile}</p>
        </div>
    );
};

export default ProfilePage;
