const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

// Connect to database
require('./app_api/models/db');

const app = express();
const port = 3000;

// CORS middleware for Angular development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// View engine setup
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'app_server', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'app_server', 'views', 'partials')
}));
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
    console.error('Server Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`🌐 Website: http://localhost:${port}/travel`);
    console.log(`📊 API: http://localhost:${port}/api/trips`);
    console.log(`⚙️  Admin Panel: Start Angular with 'ng serve' on port 4200`);
});

module.exports = app;