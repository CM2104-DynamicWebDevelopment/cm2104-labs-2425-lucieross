const MongoClient = require('mongodb-legacy').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'star_wars_quotes';

//code to link to the express module
const express = require('express');
const app = express();

//code to define the public
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

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
}

app.get('/all', function(req, res) { //all quotes
    db.collection('quotes').find().toArray(function(err, result) {
    if (err) throw err;

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

app.post('/quotes', function (req, res) { //adds quotes tab
    db.collection('quotes').insertOne(req.body, function(err, result) {
        if (err) throw err;
        console.log('saved to database')
        res.redirect('/')
    })
})

app.post('/search', function(req, res) { //searchs specific quotes
    db.collection('quotes').find(req.body).toArray(function(err, result) { //res body is what is submitted in the form
        if (err) throw err;

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

app.post('/delete', function(req, res){ //delete a quote
    db.collection('quotes').deleteOne(req.body, function(err, result){
        if (err) throw err;
        res.redirect('/');
    })
})