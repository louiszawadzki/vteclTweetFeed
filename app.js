var express  = require('express'),
    http     = require('http'),
    socketio = require('socket.io'),
    twitter  = require('twitter'),
    twitterk = require('./twitter-key'),
    exphbs = require('express-handlebars'),
    mongoose= require('mongoose');

var app = express();
var port = 8001;

// app
app.use('/static', express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.get('/', function(req,res) {
  Tweet.getTweets(0, function(tweets) {
    res.render('index', { state: JSON.stringify(tweets) });
  });
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

//mongo db
mongoose.connect('mongodb://localhost:27017/vtecl-tweets');
var schema = new mongoose.Schema({
  id     : String,
  author : String,
  avatar : String,
  text   : String,
  date   : String
});

// method to get the tweets from the db
schema.statics.getTweets = function (start, callback) {
  var tweets = [];
  // issue with the .find method
  Tweet.find({}, 'id author avatar text date', {skip: start, limit: 10}).exec(function(err,docs){
    if(!err) {
      console.log(docs);
      tweets = docs;
      console.log(tweets);
      callback(tweets);
    } else {
      console.log(err);
    }
  });
};

var Tweet = mongoose.model('Tweet', schema);


//var streamParams = {track: 'lamar'}; //for dev purpose only
var streamParams = {track: '#vtecl'};
client.stream('statuses/filter', streamParams, function(stream){
  stream.on('data', function(data) {
    var tweet = {
      id: data['id'],
      author: data['user']['name'],
      avatar: data['user']['profile_image_url'],
      text: data['text'],
      date: data['created_at']
    };
    var tweetEntry = new Tweet(tweet);
    tweetEntry.save(function(err) {
      if (!err) {
        io.emit('tweet', tweet);
      } else {
        console.log(err);
      }
    });
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

// Populate the db on app launch
var getParams = {q: '#vtecl'};
client.get('search/tweets', getParams, function (error, tweets, response) {
  //console.log(tweets);
  tweets.statuses.forEach(function(data) {
    var tweet = {
      id: data['id'],
      author: data['user']['name'],
      avatar: data['user']['profile_image_url'],
      text: data['text'],
      date: data['created_at']
    };
    var tweetEntry = new Tweet(tweet);
    tweetEntry.save(function(err) {
      if (!err) {
        console.log(tweetEntry);
      } else {
        console.log(err);
      }
    });
  });
});
