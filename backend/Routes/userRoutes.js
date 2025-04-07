const express = require("express");
const router = express.Router();
const User = require("../Models/User"); // Import User model

// API to fetch user profile by username
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            name: user.fullName,
            email: user.email,
            mobile: user.mobile,  // Ensure bio exists
            profilePicture: user.profilePicture, // Ensure profilePicture exists
            skills: user.skills, // Add skills if available
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
