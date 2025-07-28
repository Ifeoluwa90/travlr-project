const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

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

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

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
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Home page available at http://localhost:${port}/`);
    console.log(`Travel page available at http://localhost:${port}/travel`);
    console.log(`API available at http://localhost:${port}/api/trips`);
});

module.exports = app;