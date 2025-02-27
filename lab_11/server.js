var express = require('express');
var app = express();
var knockknock = require('knock-knock-jokes');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/', function(req, res){ //default shown
    res.send("Hello world! by express");
});

app.get('/test', function(req, res){ //test route
    res.send("this is route 2");
});

app.get( '/joke', function (req, res) { //joke route
    res.writeHead(200, {'Content-Type': 'text/html'});
    var randomJoke = knockknock()
    res.end(randomJoke)
})

app.get('/add', function(req, res){ //add route
    var x = parseInt(req.query.x); 
    var y = parseInt(req.query.y);
     res.send("X + Y=" + (x+y));
});

app.get('/calc', function(req, res) { //simple calculator route http://pantherdallas-tribunechris-8080/calc?x=3&y=4&operator=mul
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

app.get('/getform', function(req, res){ //handles the form request
    var name = req.query.name;
    var quest = req.query.quest;
     res.send("Hi "+name+" I am sure you will "+quest) ;
});

app.post('/postform', function(req, res) { //post form route
    var name = req.body.name;
    var quest = req.body.quest;
    res.send("Hi " + name + ", I am sure you will " + quest + ".");
});

app.get('/user/:userId/books/:bookId', function(req, res) { //books route https://pantherdallas-tribunechris-8080.codio.io/user/166/books/2
    var userId = req.params.userId;
    var bookId = req.params.bookId;

    res.send("User ID: "+ userId+ " Book ID:" + bookId+ ".");
});

app.use(function ( req, res, next) { //404 page
    res.send("This page does not exist!");
})


app.listen(8080);
