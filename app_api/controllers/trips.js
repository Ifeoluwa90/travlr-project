const mongoose = require('mongoose');
const Trip = require('../models/trips');

// Test database connection
const testConnection = async (req, res) => {
    try {
        const connectionState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.status(200).json({
            message: 'Database connection test',
            state: states[connectionState],
            database: mongoose.connection.name || 'unknown'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Database connection test failed',
            error: err.message
        });
    }
};

// GET all trips
const tripsList = async (req, res) => {
    try {
        console.log('GET /api/trips');
        const trips = await Trip.find({}).sort({ start: 1 });
        
        if (!trips || trips.length === 0) {
            return res.status(404).json({
                message: 'No trips found'
            });
        }
        
        console.log(`Found ${trips.length} trips`);
        res.status(200).json(trips);
    } catch (err) {
        console.error('Error retrieving trips:', err);
        res.status(500).json({
            message: 'Internal server error retrieving trips',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
        });
    }
};

// GET single trip by code
const tripsGetByCode = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        console.log(`GET /api/trips/${tripCode}`);
        
        if (!tripCode) {
            return res.status(400).json({
                message: 'Trip code is required'
            });
        }
        
        const trip = await Trip.findOne({ code: tripCode });
        
        if (!trip) {
            console.log(`Trip with code ${tripCode} not found`);
            return res.status(404).json({
                message: `Trip with code '${tripCode}' not found`
            });
        }
        
        console.log(`Found trip: ${trip.name}`);
        res.status(200).json(trip);
    } catch (err) {
        console.error('Error retrieving trip:', err);
        res.status(500).json({
            message: 'Internal server error retrieving trip',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
        });
    }
};

// POST - Create new trip
const tripsAddTrip = async (req, res) => {
    try {
        console.log('POST /api/trips');
        console.log('Request body:', req.body);
        console.log('Request headers:', req.headers);
        
        // Check if body is empty
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: 'Request body is empty. Make sure Content-Type is application/json'
            });
        }
        
        // Validate required fields
        const requiredFields = ['code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missingFields: missingFields,
                receivedFields: Object.keys(req.body)
            });
        }
        
        // Validate date
        const startDate = new Date(req.body.start);
        if (isNaN(startDate.getTime())) {
            return res.status(400).json({
                message: 'Invalid start date format',
                received: req.body.start
            });
        }
        
        const newTrip = new Trip({
            code: req.body.code.trim(),
            name: req.body.name.trim(),
            length: req.body.length.trim(),
            start: startDate,
            resort: req.body.resort.trim(),
            perPerson: req.body.perPerson.toString(),
            image: req.body.image.trim(),
            description: req.body.description.trim()
        });
        
        console.log('Attempting to save trip:', newTrip);
        const savedTrip = await newTrip.save();
        console.log(`Created trip: ${savedTrip.code} - ${savedTrip.name}`);
        
        res.status(201).json({
            message: 'Trip created successfully',
            trip: savedTrip
        });
    } catch (err) {
        console.error('Error creating trip:', err);
        console.error('Error stack:', err.stack);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                message: 'Validation error',
                errors: errors,
                details: err.errors
            });
        }
        
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Trip code already exists',
                code: req.body.code
            });
        }
        
        res.status(500).json({
            message: 'Internal server error creating trip',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// PUT - Update existing trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        console.log(`PUT /api/trips/${tripCode}`);
        console.log('Request body:', req.body);
        
        if (!tripCode) {
            return res.status(400).json({
                message: 'Trip code is required'
            });
        }
        
        // Prepare update data, removing empty fields
        const updateData = {};
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== '') {
                if (key === 'start') {
                    updateData[key] = new Date(req.body[key]);
                } else if (typeof req.body[key] === 'string') {
                    updateData[key] = req.body[key].trim();
                } else {
                    updateData[key] = req.body[key];
                }
            }
        });
        
        const updatedTrip = await Trip.findOneAndUpdate(
            { code: tripCode },
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        if (!updatedTrip) {
            console.log(`Trip with code ${tripCode} not found for update`);
            return res.status(404).json({
                message: `Trip with code '${tripCode}' not found`
            });
        }
        
        console.log(`Updated trip: ${updatedTrip.code} - ${updatedTrip.name}`);
        res.status(200).json({
            message: 'Trip updated successfully',
            trip: updatedTrip
        });
    } catch (err) {
        console.error('Error updating trip:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                message: 'Validation error',
                errors: errors
            });
        }
        
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid data format',
                field: err.path
            });
        }
        
        res.status(500).json({
            message: 'Internal server error updating trip',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
        });
    }
};

// DELETE - Remove trip
const tripsDeleteTrip = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        console.log(`DELETE /api/trips/${tripCode}`);
        
        if (!tripCode) {
            return res.status(400).json({
                message: 'Trip code is required'
            });
        }
        
        const deletedTrip = await Trip.findOneAndDelete({ code: tripCode });
        
        if (!deletedTrip) {
            console.log(`Trip with code ${tripCode} not found for deletion`);
            return res.status(404).json({
                message: `Trip with code '${tripCode}' not found`
            });
        }
        
        console.log(`Deleted trip: ${deletedTrip.code} - ${deletedTrip.name}`);
        res.status(200).json({
            message: 'Trip deleted successfully',
            trip: deletedTrip
        });
    } catch (err) {
        console.error('Error deleting trip:', err);
        res.status(500).json({
            message: 'Internal server error deleting trip',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
        });
    }
};

module.exports = {
    testConnection,
    tripsList,
    tripsGetByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};