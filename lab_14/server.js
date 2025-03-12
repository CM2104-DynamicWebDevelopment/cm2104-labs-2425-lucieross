const express = require('express');
const path = require('path');
const app = express();

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Set view engine to ejs
app.set('view engine', 'ejs');

// index route
//app.get('/', (req, res) => {
//  res.render('pages/index');
//});

app.get('/', function(req, res) {
    var drinks = [
    { name: 'Bloody Mary', drunkness: 3 },
    { name: 'Martini', drunkness: 5 },
    { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
    res.render('pages/index', {
    drinks: drinks,
    tagline: tagline
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8080);