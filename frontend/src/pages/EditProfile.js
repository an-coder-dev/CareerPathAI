import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './EditProfile.css';

const EditProfile = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        bio: '',
        profileImage: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        const storedProfileImage = localStorage.getItem('profileImage');

        if (user) {
            const userObj = JSON.parse(user);
            setUserDetails({
                name: userObj.name || '',
                bio: userObj.bio || '',
                profileImage: storedProfileImage || "https://via.placeholder.com/100"
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserDetails(prevState => ({
                    ...prevState,
                    profileImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userDetails)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update local storage
            localStorage.setItem('loggedInUser', JSON.stringify(userDetails));
            localStorage.setItem('profileImage', userDetails.profileImage);

            handleSuccess('Profile updated successfully!');
            navigate('/home');
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={userDetails.bio}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <img src={userDetails.profileImage} alt="Profile" className="profile-pic" />
                </div>
                <button type="submit" className="submit-btn">Save Changes</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditProfile;