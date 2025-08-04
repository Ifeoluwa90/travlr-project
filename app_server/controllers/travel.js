const request = require('request');

// API configuration
const apiOptions = {
    server: 'http://localhost:3000'
};

// Helper function to make API requests
const makeAPIRequest = (path, callback) => {
    const requestOptions = {
        url: `${apiOptions.server}/api/${path}`,
        method: 'GET',
        json: {},
        timeout: 5000
    };
    
    console.log(`Making API request to: ${requestOptions.url}`);
    
    request(requestOptions, (err, response, body) => {
        if (err) {
            console.error('API request error:', err);
            return callback(err, null);
        }
        
        if (response.statusCode !== 200) {
            console.error(`API returned status ${response.statusCode}:`, body);
            return callback(new Error(`API Error: ${response.statusCode}`), null);
        }
        
        callback(null, body);
    });
};

/* GET home view */
const home = (req, res) => {
    res.render('index', { title: 'Travlr Getaways' });
};

/* GET travel view */
const travel = (req, res) => {
    makeAPIRequest('trips', (err, trips) => {
        if (err) {
            console.error('Error fetching trips from API:', err);
            // Render with empty trips array if API fails
            return res.render('travel/index', { 
                title: 'Travlr Getaways',
                trips: [],
                error: 'Unable to load trips at this time'
            });
        }
        
        console.log(`Received ${trips.length} trips from API`);
        res.render('travel/index', { 
            title: 'Travlr Getaways',
            trips: trips
        });
    });
};

module.exports = {
    home,
    travel
};