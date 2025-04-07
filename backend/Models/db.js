const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const mongo_url = process.env.MONGO_CONN;

if (!mongo_url) {
    console.error('❌ MONGO_CONN is not defined. Check your .env file.');
    process.exit(1);  // Exit the process if MongoDB URL is missing
}

const connectDB = async () => {
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected Successfully...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);  // Stop server if database connection fails
    }
};

module.exports = connectDB;
