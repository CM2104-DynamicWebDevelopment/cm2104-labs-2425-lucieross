//code to link to mongo module
const MongoClient = require('mongodb-legacy').MongoClient;


const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'star_wars_quotes';

//code to link to the express module
const express = require('express');
const app = express();

const bodyParser = require('body-parser')

//code to define the public
app.use(express.static('public'))
//allows us to read a post request
app.use(express.urlencoded({
    extended: true
}))
app.use(bodyParser.urlencoded({extended: true}))
// set the view engine to ejs
app.set('view engine', 'ejs');
//our variable for our database
var db;

//run the connect method.
connectDB();

async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    //everything is good lets start
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}

//you need to complete these

app.get('/', function(req, res) {
  db.collection('quotes').find().toArray(function(err, result) {
    if (err) throw err;
    res.render('pages/index', { quotes: result });
  });
});

app.get('/add', function(req,res) {
  res.render('pages/add')
});

app.get('/delete', function(req,res) {
  res.render('pages/delete')
});

app.get('/filter', function(req,res) {
  res.render('pages/filter')
});

app.get('/update', function(req,res) {
  res.render('pages/update')
});

app.post('/delete', function(req, res) { //delete quotes method
  db.collection('quotes').deleteOne(req.body, function(err, result) {
      if (err) throw err;
      res.redirect('/');
  });
});

app.post('/quotes', function (req, res) { //adds quotes tab
  db.collection('quotes').insertOne(req.body, function(err, result) {
      if (err) throw err;
      console.log('saved to database')
      res.redirect('/')
  })
})

app.post('/search', function(req, res) {
  // Get the search criteria (name) from the form submission
  const searchName = req.body.name;

  // Find the quotes matching the name
  db.collection('quotes').find({ name: { $regex: searchName, $options: 'i' } }).toArray(function(err, result) {
    if (err) throw err;

    // Render the index page with the search results
    res.render('pages/index', { quotes: result, searchName: searchName });
  });
});


app.post('/update', function(req, res) { //update quotes function
  var query = { quote: req.body.quote };
  var newvalues = { $set: {name: req.body.newname, quote: req.body.newquote } };

  db.collection('quotes').updateOne(query,newvalues, function(err, result) {
      if (err) throw err;
      res.redirect('/');
  });
});


app.get('/allquotes', function(req, res) {
  db.collection('quotes').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    var output = "<h1>All the quotes</h1>";
    for (var i = 0; i < result.length; i++) {
      output += "<div>"
      output += "<h3>" + result[i].name + "</h3>"
      output += "<p>" + result[i].quote + "</p>"
      output += "</div>"
    }
    res.send(output);
  });
});

