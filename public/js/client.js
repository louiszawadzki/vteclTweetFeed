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
          {comment.text}
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
    return {data: []};
  },
  componentDidMount: function() {
    // get the existing list of tweets
    var box = this;
    socket.on('tweet', function(data) {
      box.setState({data: box.state.data.concat([data])});
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>vtecl</h1>
        <CommentList data={this.state.data} />
      </div>
    );
  }
});
ReactDOM.render (
  <CommentBox />,
  tweet
);
