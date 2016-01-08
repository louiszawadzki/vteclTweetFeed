var tweet = document.getElementById("tweet");
var socket = io();
socket.on('tweet', function (data) {
  tweet.innerText = data;
});
