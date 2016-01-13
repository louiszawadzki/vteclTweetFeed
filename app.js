var express  = require('express'),
    http     = require('http'),
    socketio = require('socket.io'),
    twitter  = require('twitter'),
    twitterk = require('./twitter-key');

var app = express();
var port = 8001;

// app
app.use('/static', express.static('public'));
app.get('/', function(req,res) {
  res.sendFile("index.html", { root: __dirname + "/public" });
});
var server = http.createServer(app).listen(port, function() {
  console.log("yippie");
});

//socket.io
var io = socketio.listen(server);

// twitter
var client = new twitter({
  consumer_key: twitterk.key,
  consumer_secret: twitterk.secret,
  access_token_key: twitterk.token,
  access_token_secret: twitterk.tsecret
});

var params = {track: 'lamar'}; //for dev purpose only
//var params = {track: 'vtecl'};
client.stream('statuses/filter', params, function(stream){
  stream.on('data', function(tweet) {
    console.log(tweet);
    io.emit('tweet', tweet);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
