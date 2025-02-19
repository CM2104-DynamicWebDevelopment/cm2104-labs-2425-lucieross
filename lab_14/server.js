const express = require('express');
const path = require('path');
const app = express();

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Example route
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.listen(8080);