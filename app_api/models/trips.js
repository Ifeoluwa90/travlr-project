const mongoose = require('mongoose');

// Define the Trip schema
const tripSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Trip code is required'],
        unique: true,
        trim: true,
        maxLength: [10, 'Trip code cannot exceed 10 characters']
    },
    name: {
        type: String,
        required: [true, 'Trip name is required'],
        trim: true,
        maxLength: [100, 'Trip name cannot exceed 100 characters']
    },
    length: {
        type: String,
        required: [true, 'Trip length is required'],
        trim: true
    },
    start: {
        type: Date,
        required: [true, 'Start date is required']
    },
    resort: {
        type: String,
        required: [true, 'Resort name is required'],
        trim: true,
        maxLength: [100, 'Resort name cannot exceed 100 characters']
    },
    perPerson: {
        type: String,
        required: [true, 'Price per person is required'],
        validate: {
            validator: function(v) {
                return /^\d+(\.\d{1,2})?$/.test(v);
            },
            message: 'Price must be a valid number with up to 2 decimal places'
        }
    },
    image: {
        type: String,
        required: [true, 'Image filename is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add indexes for better query performance
tripSchema.index({ code: 1 });
tripSchema.index({ name: 1 });
tripSchema.index({ start: 1 });

// Create and export the model
const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;