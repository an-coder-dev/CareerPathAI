const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const authenticateToken = require('../Middlewares/Auth');
const User = require('../Models/User');
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const { getUserData } = require("../Controllers/AuthController");
const authMiddleware = require("../Middlewares/Auth");
const router = express.Router();
// Multer Storage Setup for Profile Pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ dest: "uploads/" });

// Auth Routes
router.post('/signup', upload.single('profilePicture'), signupValidation, signup);
router.post('/login', loginValidation, login);
router.get("/user", authMiddleware, getUserData);

// Fetch User Details Route (Protected)
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
