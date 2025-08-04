const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

// Set development mode for better error messages
process.env.NODE_ENV = 'development';

// Import database connection
require('./app_api/models/db');

const app = express();
const port = 3000;

// View engine setup
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'app_server', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'app_server', 'views', 'partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server', 'views'));

// Body parser middleware (IMPORTANT - must be before routes!)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', req.body);
    }
    next();
});

// Routes
const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes/index');

// Use routes
app.use('/', travelRouter);
app.use('/api', apiRouter);

// Error handler for 404
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Application error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Home page available at http://localhost:${port}/`);
    console.log(`Travel page available at http://localhost:${port}/travel`);
    console.log(`API available at http://localhost:${port}/api/trips`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});

module.exports = app;