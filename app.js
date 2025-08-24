const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

// Connect to database
require('./app_api/models/db');

const app = express();
const port = 3000;

// CORS middleware for Angular development
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Create Handlebars instance with helpers
const hbsInstance = hbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'app_server', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'app_server', 'views', 'partials'),
    // Register helpers
    helpers: {
        formatDate: function(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        formatPrice: function(price) {
            if (!price) return '$0.00';
            return `$${price}`;
        },
        truncateText: function(text, length) {
            if (!text) return '';
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        }
    }
});

// View engine setup
app.engine('hbs', hbsInstance.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server', 'views'));

// Parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes/index');

app.use('/', travelRouter);           // Website routes
app.use('/api', apiRouter);           // API routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Detailed Server Error:');
    console.error('URL:', req.url);
    console.error('Method:', req.method);
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
        details: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// 404 handler
app.use((req, res) => {
    console.log('❌ 404 - Route not found:', req.url);
    res.status(404).json({ message: 'Route not found', url: req.url });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`🌐 Website: http://localhost:3000/travel`);
    console.log(`📊 API: http://localhost:3000/api/trips`);
    console.log(`⚙️  Admin Panel: Start Angular with 'ng serve' on port 4200`);
});

module.exports = app;