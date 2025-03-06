// Code to link to mongo module
const MongoClient = require('mongodb-legacy').MongoClient; // npm install mongodb-legacy
const url = 'mongodb://127.0.0.1:27017'; // the URL of our database
const client = new MongoClient(url); // create the mongo client
const dbname = 'profiles'; // the database we want to access

const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser

const app = express();

// This tells express we are using sessions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));

// Code to define the public "static" folder
app.use(express.static('public'));

// Code to tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Variable to hold our Database
var db;

// Run the connect method.
connectDB();
// This is our connection to the mongo DB, it sets the variable db as our database
async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    // Everything is good, let's start
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}

//********** GET ROUTES - Deal with displaying pages ***************************

// This is our root route
app.get('/', function(req, res) {
  console.log("Session LoggedIn: ", req.session.loggedin); // Log session status
  // If the user is not logged in, redirect them to the login page
  if (!req.session.loggedin) { 
    res.redirect('/login'); 
    return; 
  }

  // Otherwise, perform a search to return all the documents in the people collection
  db.collection('people').find().toArray(function(err, result) {
    if (err) {
      console.log("Error:", err);
      throw err;
    }

    console.log("Users result:", result); // Log the result from the DB query
    // The result of the query is sent to the user's page as the "users" array
    res.render('pages/users', {
      users: result,
      loggedInUser: req.session.user
    });
  });
});

// This is our login route, all it does is render the login.ejs page.
app.get('/login', function(req, res) {
  res.render('pages/login');
});

app.get('/profile', function(req, res) {
  console.log("Session LoggedIn: ", req.session.loggedin); // Log session status
  if (!req.session.loggedin) { 
    res.redirect('/login'); 
    return; 
  }

  var uname = req.query.username;
  console.log("Query username for profile:", uname); // Log the username from the query

  db.collection('people').findOne({"login.username": uname}, function(err, result) {
    if (err) {
      console.log("Error:", err);
      throw err;
    }

    console.log("Profile result:", result); // Log the profile result from the DB
    res.render('pages/profile', {
      user: result
    });
  });
});

// Add user route simply draws our adduser page
app.get('/adduser', function(req, res) {
  console.log("Session LoggedIn: ", req.session.loggedin); // Log session status
  if (!req.session.loggedin) { 
    res.redirect('/login'); 
    return; 
  }
  res.render('pages/adduser');
});

// Log out route causes the page to log out
// It sets our session.loggedin to false and then redirects the user to the login
app.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/');
});

//********** POST ROUTES - Deal with processing data from forms ***************************

app.post('/dologin', function(req, res) {
  console.log("Login Request:", JSON.stringify(req.body)); // Log the body of the login request
  var uname = req.body.username;
  var pword = req.body.password;

  console.log("Login - Username:", uname, "Password:", pword); // Log username and password from the form

  db.collection('people').findOne({"login.username": uname}, function(err, result) {
    if (err) {
      console.log("Error:", err);
      throw err;
    }

    console.log("Login result:", result); // Log the result of the login query

    if (!result) {
      res.redirect('/login');
      return;
    }

    if (result.login.password == pword) {
      req.session.loggedin = true;
      req.session.user = result; // Stores user
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});

app.post('/delete', function(req, res) {
  // Check we are logged in.
  if (!req.session.loggedin) { 
    res.redirect('/login'); 
    return; 
  }
  
  // If so, get the username variable
  var uname = req.body.username;
  console.log("Delete request for username:", uname); // Log the username from the delete request

  // Check for the username added in the form, if one exists then you can delete that document
  db.collection('people').deleteOne({"login.username": uname}, function(err, result) {
    if (err) {
      console.log("Error:", err);
      throw err;
    }
    console.log("Delete result:", result); // Log the result of the delete operation
    res.redirect('/');
  });
});

app.get('/update', (req, res) => {
  if (!req.session.loggedin) { 
    res.redirect('/login'); 
    return; 
  }

  // Get user name
  const loggedInUser = req.session.user;

  console.log("Logged in user for update:", loggedInUser); // Log the logged-in user details

  // Render form and pass the details
  res.render('pages/update', {
    user: loggedInUser
  });
});

app.post('/doupdate', function(req, res) {
  // Get user name
  const uname = req.session.user.login.username;

  // Get the updated details from the form
  const updatedDetails = {
    "gender": req.body.gender,
    "name": {
      "title": req.body.title,
      "first": req.body.first,
      "last": req.body.last
    },
    "email": req.body.email,
    "location": {
      "street": req.body.street,
      "city": req.body.city,
      "state": req.body.state,
      "postcode": req.body.postcode
    }
  };

  console.log("Update details:", updatedDetails); // Log the updated details from the form

  // Update the user details in mongo
  db.collection('people').updateOne(
    { "login.username": uname }, // Find the user
    { $set: updatedDetails }, // Update the user data with the new details
    function(err, result) {
      if (err) {
        console.log("Error:", err);
        throw err;
      }

      req.session.user = { ...req.session.user, ...updatedDetails }; // Update the session data so that they can see changes
      res.redirect('/profile?username=' + uname); // Redirect to profile page
    }
  );
});

// The adduser route deals with adding a new user
app.post('/adduser', function(req, res) {
  // Check we are logged in
  if (!req.session.loggedin) { 
    res.redirect('/login'); 
    return; 
  }

  // We create the data string from the form components that have been passed in
  var datatostore = {
    "gender": req.body.gender,
    "name": { "title": req.body.title, "first": req.body.first, "last": req.body.last },
    "location": { "street": req.body.street, "city": req.body.city, "state": req.body.state, "postcode": req.body.postcode },
    "email": req.body.email,
    "login": { "username": req.body.username, "password": req.body.password },
    "dob": req.body.dob,
    "registered": Date(),
    "picture": { "large": req.body.large, "medium": req.body.medium, "thumbnail": req.body.thumbnail },
    "nat": req.body.nat
  };

  console.log("Add User data:", datatostore); // Log the data to be inserted into the DB

  // Once created, we just run the data string against the database and all our new data will be saved
  db.collection('people').insertOne(datatostore, function(err, result) {
    if (err) {
      console.log("Error:", err);
      throw err;
    }

    console.log('Saved to database'); // Log successful insertion
    res.redirect('/');
  });
});
