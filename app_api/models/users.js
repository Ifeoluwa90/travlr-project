const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.methods.setPassword = function(password) {
    this.hash = bcrypt.hashSync(password, 10);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET || 'MY_SECRET');
};

module.exports = mongoose.model('User', userSchema);