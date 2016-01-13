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
          <div className="authorPic" style={{backgroundImage: 'url(' + comment.user.profile_image_url+ ')'}}>
          </div>
          <div className="tweetText">
            <div className="author">
              {comment.user.name}
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
    return {data: []};
  },
  componentDidMount: function() {
    // get the existing list of tweets
    var box = this;
    socket.on('tweet', function(data) {
      box.setState({data: [data].concat(box.state.data)});
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>#vtecl</h1>
        <CommentList data={this.state.data} />
      </div>
    );
  }
});
ReactDOM.render (
  <CommentBox />,
  tweet
);
