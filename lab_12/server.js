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
        res.send(JSON.stringify(data.body));
    }, function (err){
        console.error(err);
    });
}

app.get('/searchLove', function (req,res){
    getTracks('love', res);
});