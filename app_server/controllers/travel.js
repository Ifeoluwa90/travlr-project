const fs = require('fs');
const path = require('path');

/* GET home view */
const home = (req, res) => {
    res.render('index', { title: 'Travlr Getaways' });
};

/* GET travel view */
const travel = (req, res) => {
    const dataPath = path.join(__dirname, '../../data/trips.json');
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading trips data:', err);
            res.render('travel/index', { 
                title: 'Travlr Getaways',
                trips: []
            });
        } else {
            const trips = JSON.parse(data);
            res.render('travel/index', { 
                title: 'Travlr Getaways',
                trips: trips
            });
        }
    });
};

module.exports = {
    home,
    travel
};