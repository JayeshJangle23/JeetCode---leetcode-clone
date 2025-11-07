const mongoose = require('mongoose');

async function main() {
    try {
        const connectionString = process.env.MONGO_URL || 'mongodb://localhost:27017/leetcode-clone';
        
        await mongoose.connect(connectionString,{
            dbName: "Leetcode"
        });
        
        // console.log('✅ MongoDB connected successfully!');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
        
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        throw error;
    }
}

module.exports = main;

