const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

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

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Register routes
const travelRouter = require('./app_server/routes/travel');

// Use the travel router for /travel routes
app.use('/travel', travelRouter);

// Default route (redirect to travel)
app.get('/', (req, res) => {
    res.redirect('/travel');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Travel page available at http://localhost:${port}/travel`);
});

module.exports = app;