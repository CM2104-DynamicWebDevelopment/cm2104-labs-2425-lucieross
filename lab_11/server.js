var express = require('express');
var app = express();
var knockknock = require('knock-knock-jokes');

app.use(express.static('public'));

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

    var result;

    switch (operator) {
        case 'add':
            result =x + y;
            break;
        case 'sub':
            result = x - y;
            break;
        case 'mul':
            result = x * y;
            break;
        case 'div':
            result = x / y;
            break;
    }
    res.send(result.toString());
});

app.get('/getform', function(req, res){
    var name = req.query.name;
    var quest = req.query.quest;
     res.send("Hi "+name+" I am sure you will "+quest) ;
});


app.listen(8080);
