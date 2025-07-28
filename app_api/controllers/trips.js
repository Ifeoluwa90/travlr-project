const mongoose = require('mongoose');
const Trip = require('../models/trips');

// GET all trips
const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).sort({ start: 1 });
        
        if (!trips || trips.length === 0) {
            return res.status(404).json({
                message: 'No trips found'
            });
        }
        
        res.status(200).json(trips);
    } catch (err) {
        console.error('Error retrieving trips:', err);
        res.status(500).json({
            message: 'Error retrieving trips',
            error: err.message
        });
    }
};

// GET single trip by ID
const tripsGetByCode = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        
        if (!tripCode) {
            return res.status(400).json({
                message: 'Trip code is required'
            });
        }
        
        const trip = await Trip.findOne({ code: tripCode });
        
        if (!trip) {
            return res.status(404).json({
                message: `Trip with code ${tripCode} not found`
            });
        }
        
        res.status(200).json(trip);
    } catch (err) {
        console.error('Error retrieving trip:', err);
        res.status(500).json({
            message: 'Error retrieving trip',
            error: err.message
        });
    }
};

// POST - Create new trip
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });
        
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (err) {
        console.error('Error creating trip:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                message: 'Validation error',
                errors: errors
            });
        }
        
        if (err.code === 11000) {
            return res.status(400).json({
                message: 'Trip code already exists'
            });
        }
        
        res.status(500).json({
            message: 'Error creating trip',
            error: err.message
        });
    }
};

// PUT - Update existing trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const tripCode = req.params.tripCode;
        
        if (!tripCode) {
            return res.status(400).json({
                message: 'Trip code is required'
            });
        }
        
        const updatedTrip = await Trip.findOneAndUpdate(
            { code: tripCode },
            req.body,
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        if (!updatedTrip) {
            return res.status(404).json({
                message: `Trip with code ${tripCode} not found`
            });
        }
        
        res.status(200).json(updatedTrip);
    } catch (err) {
        console.error('Error updating trip:', err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                message: 'Validation error',
                errors: errors
            });
        }
        
        res.status(500).json({
            message: 'Error updating trip',
            error: err.message
        });
    }
};

module.exports = {
    tripsList,
    tripsGetByCode,
    tripsAddTrip,
    tripsUpdateTrip
};