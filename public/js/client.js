var tweet = document.getElementById("tweet");
var socket = io();

var Tweet = React.createClass({
  render: function(){
    return (this.props.children);
  }
});

var CommentList = React.createClass({
  render: function() {
    var tweets = this.props.data.map(function(comment) {
      return (
        <div className="tweet" key={comment.id}>
          <div className="authorPic" style={{backgroundImage: 'url(' + comment.avatar + ')'}}>
          </div>
          <div className="tweetText">
            <div className="author">
              {comment.author}
            </div>
            {comment.text}
          </div>
        </div>
      );
    });
    return (
      <div className="commentList">
        {tweets}
      </div>
    );
  }
});
var CommentBox = React.createClass({
  getInitialState: function() {
    var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);
    return {data: initialState};
  },
  componentDidMount: function() {
    // get the existing list of tweets
    var self = this;
    socket.on('tweet', function(data) {
      self.setState({data: [data].concat(self.state.data)});
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Derniers tweets</h1>
        <CommentList data={this.state.data} />
      </div>
    );
  }
});
ReactDOM.render (
  <CommentBox />,
  tweet
);
