var express = require('express');
var path = require('path');
var app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Explicitly set the views folder
app.set('views', path.join(__dirname, 'views'));

// Index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8080, function() {
    console.log('8080 is the magic port');
});
