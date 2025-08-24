const request = require('request');

const apiOptions = {
    server: 'http://localhost:3000'
};

// Home page
const homePage = (req, res) => {
    res.render('index', { title: 'Travlr Getaways' });
};

// Travel list page
const travelList = (req, res) => {
    const path = '/api/trips';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {}
    };

    console.log('🔄 Requesting trips from API:', requestOptions.url);

    request(requestOptions, (err, response, body) => {
        if (err) {
            console.error('❌ API Request Error:', err);
            return res.render('travel', {
                title: 'Travlr Getaways',
                trips: [],
                error: 'Unable to connect to API'
            });
        }

        if (response.statusCode !== 200) {
            console.error('❌ API Response Error:', response.statusCode, body);
            return res.render('travel', {
                title: 'Travlr Getaways',
                trips: [],
                error: `API returned status ${response.statusCode}`
            });
        }

        console.log('✅ API Response received, trips count:', body ? body.length : 0);

        res.render('travel', {
            title: 'Travlr Getaways',
            trips: body || []
        });
    });
};

module.exports = {
    homePage,
    travelList
};