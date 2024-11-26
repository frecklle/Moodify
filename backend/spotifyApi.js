const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: 'f1421233aeb34b86bab2cd04cefdd9f7',
    clientSecret: 'f24909c421a04804a26c8fa7f75fe2da',
    redirectUri: 'http://localhost:5001/spotify/callback'
});

module.exports = spotifyApi;