const mongoose = require('mongoose');
const User = require('../models/users');

// Connect to database
const dbURI = 'mongodb://localhost:27017/travlr';
mongoose.connect(dbURI);

// Connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
    seedUsers();
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create admin user
        const adminUser = new User();
        adminUser.email = 'admin@travlr.com';
        adminUser.name = 'Admin User';
        adminUser.setPassword('password123');

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@travlr.com');
        console.log('Password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

// Handle app termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});