var express = require('express');
var app = express();
var SpotifyWebAPI = require('spotify-web-api-node');
app.use(express.static('public'));

var spotifyAPI = new SpotifyWebAPI({
    clientId: '7c9ea5ba3f3242408bdee87a90f83a0a',
    clientSecret: '75701a2b46fa4ffcaf93209a6223e7a5'
})

//Recieve an access token
spotifyAPI.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The acess token is ' + data.body['access_token']);

        //Save token
        spotifyAPI.setAccessToken(data.body['access_token']);
    },

    function (err) {
        console.log ('Something went wrong when recieveing access token',
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
                "<div>" + 
                    "<a href='" + track.external_urls.spotify + "'>Track details</a>" +
                "</div>" +
            "</div>";
            console.log(HTMLResponce);
        }
        res.send(HTMLResponce);
    }, function (err){
        console.error(err);
    });
}


app.get('/searchLove', function (req,res){
    getTracks('love', res);
});

app.listen(8080);
