const express = require('express');
const router = express.Router();

router.get('/notifications', async (req, res) => {
    try {
        // Example data - replace this with dynamic data from a database
        const notifications = [
            { id: 1, message: "New Job Opening: Software Engineer at Google", type: "job" },
            { id: 2, message: "🔥 Trending Course: Full Stack Development Bootcamp", type: "course" },
            { id: 3, message: "Career Tip: AI and ML are the future. Start learning today!", type: "tip" },
            { id: 4, message: "Internship Alert: Data Science Internship at Amazon", type: "job" }
        ];

        res.json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
