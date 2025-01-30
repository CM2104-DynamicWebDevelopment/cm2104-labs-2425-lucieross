var express = require('express');
var app = express();
var knockknock = require('knock-knock-jokes');

app.get('/', function(req, res){
    res.send("Hello world! by express");
});

app.get('/test', function(req, res){
    res.send("this is route 2");
});

app.get( '/joke', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var randomJoke = knockknock()
    res.end(randomJoke)
})

app.get('/add', function(req, res){
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
     res.send("X + Y=" + (x+y));
});

app.get('/calc', function(req, res) {
    var x = parseFloat(req.query.x);  
    var y = parseFloat(req.query.y);  
    var operator = req.query.operator;  

    switch (operator) {
        case 'add':
            res.send(x + y);
            break;
        case 'sub':
            res.send(x - y);
            break;
        case 'mul':
            res.send(x * y);
            break;
        case 'div':
            res.send(x / y);
            break;
        default:
            return res.status(400).send("");
    }
});


app.listen(8080);