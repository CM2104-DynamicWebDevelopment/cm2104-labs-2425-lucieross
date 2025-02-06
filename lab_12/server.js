var express = require('express');
var app = express();
var SpotifyWebAPI = require('spotify-web-api-node');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/', function(req, res){ //default shown
    res.send("Hello world! by express");
});

var spotifyAPI = new SpotifyWebAPI({
    clientId: '7c9ea5ba3f3242408bdee87a90f83a0a',
    clientSecret: '75701a2b46fa4ffcaf93209a6223e7a5'
})

//rsecieve an access token
spotifyAPI.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The acess token is ' + data.body['access_token']);

        //Saves token
        spotifyAPI.setAccessToken(data.body['access_token']);
    },

    function (err) {
        console.log ('something went wrong when recieveing access token',
        err.message
        );

    }
);

async function getTracks(searchterm, res) {  
    spotifyAPI.searchTracks(searchterm)
    .then (function (data){
        var tracks = data.body.tracks.items //sets up empty stirng to act as the response
        var HTMLResponce = ""; 
        for (var i = 0; i<tracks.length; i++){ //runs through all tracks
            var track = tracks[i];
            console.log(track.name);

            HTMLResponce = HTMLResponce + 
            "<div>" +
                "<h2>" + track.name+"</h2>" +
                "<h4>" + track.artists[0].name+"</h4>"+
                "<img src = '"+ track.album.images[0].url+"'>"+
                "<div>" + //added div for formatting
                    "<a href='" + track.external_urls.spotify + "'>Track details</a>" +
                "</div>" +
                "</div>" + //formatting
                "<a href='/artistTopTracks/" + track.artists[0].id + "'>Get Top Tracks</a>" +
                "</div>" + 
                "</div>" + //formatting
                "<a href='/artists/" + track.artists[0].id + "/related-artists' >Get Top Tracks</a>" +
                "</div>" + 
            "</div>";
        }
        res.send(HTMLResponce);
    }, function (err){
        console.error(err);
    });
}

async function getTopTracks(artistId, res) { 
    spotifyAPI.getArtistTopTracks(artistId, 'GB')
        .then(function (data) {
            var topTracks = data.body.tracks;
            var HTMLResponse = "";

            if (topTracks && topTracks.length > 0) { 
                for (var i = 0; i < topTracks.length; i++) {
                    var track = topTracks[i];
                    HTMLResponse += 
                        "<div>" +
                            "<h2>  Top Tracks </h2> "+ 
                            "<h3>" + track.name + "</h3>" +
                            "<h4>" + track.artists[0].name + "</h4>" +
                            "<img src='" + track.album.images[0].url + "'>" +
                            "<div>" +
                                "<a href='" + track.external_urls.spotify + "'>Track details</a>" +
                            "</div>" +
                        "</div>";
                }
            } else {
                HTMLResponse += "<p>No top tracks found for this artist.</p>";
            }

            res.send(HTMLResponse); 
        }, function (err) {
            console.log('Something went wrong while fetching top tracks!', err);
        });
}

async function getRelated(artist, res) {
    spotifyAPI.getArtistRelatedArtists(artist)
    .then(function (data) {
        console.log(data.body);
    }, function (err){
        console.log('something went wrong!', err);
    })
}

app.get('/searchLove', function (req,res){
    getTracks('love', res);
});

app.get('/search', function(req, res){ //https://pantherdallas-tribunechris-8080.codio.io/form.html
    var searchterm = req.query.searchterm;
    getTracks(searchterm, res);
})

app.get('/artistTopTracks/:artistId', function (req, res){ //gets artist ID
    var artistId = req.params.artistId;
    getTopTracks(artistId,res); //shows top tracks
})

app.get('/artists/:artistId/related-artists'), function (req, res){
    var artistId = req.params.artistId;
    getRelated(artistId,res); 
}




app.listen(8080);
