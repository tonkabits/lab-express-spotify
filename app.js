require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node')

// Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})
// retrive an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retriving an access token', error))



const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    const artist = req.query.artist
    console.log(artist)
    spotifyApi
        .searchArtists(artist)
        .then( data => {
            console.log('The Recieved data: ', data.body)
            res.render('artist-search-results', {data})
            console.log('The Recieved data: ', data.body.artists.items[0])
        })
        .catch(err => console.log('The err', err))

    
})

app.get('/albums/:id', (req, res) => {
    const artistId = req.params.id 
    console.log(artistId)
    spotifyApi
        .getArtistAlbums(artistId)
        .then( data => {
            console.log( 'this is the almbums data' , data.body)
            res.render('albums', {data})

        }
            
        )
        .catch()
})

app.get('/tracks/:id', (req, res) => {
    const albumId = req.params.id 
    console.log(albumId)
    spotifyApi
        .getAlbumTracks(albumId)
        .then( data => {
            // check the structure
            console.log('tracks :', data.body)
            res.render('tracks', {data})
            
        }

        )
        .catch()
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
