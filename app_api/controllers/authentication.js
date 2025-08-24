const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/users');

const register = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    
    user.save()
        .then(() => {
            const token = user.generateJwt();
            res.status(200).json({ token });
        })
        .catch(err => {
            res.status(400).json(err);
        });
};

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        if (!user.validPassword(req.body.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = user.generateJwt();
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login
};