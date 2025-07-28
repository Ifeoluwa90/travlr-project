const mongoose = require('mongoose');
const Trip = require('../models/trips');

// Sample trip data
const trips = [
    {
        code: "GALR01",
        name: "Gale Reef",
        length: "4 days",
        start: new Date("2025-06-01"),
        resort: "Coral Sands",
        perPerson: "799.00",
        image: "reef1.jpg",
        description: "Sed et augue lorem. In sit amet placerat arcu. Mauris volutpat ipsum ac justo mollis vel vestibulum orci gravida. Vestibulum sit amet porttitor odio. Nulla facilisi. Fusce at pretium felis. Sed consequat libero ut turpis venenatis ut aliquam risus semper."
    },
    {
        code: "DAWR02",
        name: "Dawson's Reef",
        length: "7 days",
        start: new Date("2025-06-15"),
        resort: "Blue Lagoon",
        perPerson: "1199.00",
        image: "reef2.jpg",
        description: "Integer magna leo, posuere et dignissim vitae, porttitor at odio. Pellentesque a metus nec magna placerat volutpat. Nunc nisi mi, elementum sit amet aliquet quis, tristique quis nisl. Curabitur odio lacus, blandit ut hendrerit vulputate, vulputate at est."
    },
    {
        code: "CLTR03",
        name: "Claire's Reef",
        length: "5 days",
        start: new Date("2025-07-01"),
        resort: "Paradise Bay",
        perPerson: "899.00",
        image: "reef3.jpg",
        description: "Donec sed felis risus. Nulla facilisi. Donec a orci tellus, et auctor odio. Fusce ac orci nibh, quis semper arcu. Cras orci neque, euismod et accumsan ac, sagittis molestie lorem. Proin odio sapien, elementum at tempor non, vulputate eget libero."
    },
    {
        code: "ADVR04",
        name: "Adventure Cove",
        length: "3 days",
        start: new Date("2025-07-15"),
        resort: "Ocean View Resort",
        perPerson: "699.00",
        image: "reef4.jpg",
        description: "Experience the thrill of underwater exploration at Adventure Cove. This exciting destination offers crystal clear waters and abundant marine life. Perfect for both beginner and experienced divers looking for an unforgettable adventure."
    },
    {
        code: "TROP05",
        name: "Tropical Paradise",
        length: "6 days",
        start: new Date("2025-08-01"),
        resort: "Sunset Beach",
        perPerson: "1099.00",
        image: "reef5.jpg",
        description: "Immerse yourself in the beauty of Tropical Paradise, where pristine coral reefs meet white sandy beaches. This premium destination offers luxury accommodations and world-class diving experiences in one of the most beautiful locations on Earth."
    }
];

// Function to seed the database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/travlr');
        console.log('Connected to MongoDB');
        
        // Clear existing trips
        await Trip.deleteMany({});
        console.log('Cleared existing trips');
        
        // Insert new trips
        const insertedTrips = await Trip.insertMany(trips);
        console.log(`Successfully inserted ${insertedTrips.length} trips:`);
        
        insertedTrips.forEach(trip => {
            console.log(`- ${trip.code}: ${trip.name}`);
        });
        
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
};

// Run the seed function
seedDatabase();