function scrollToBottom(time) {
	$('html, body').animate({ scrollTop: $(document).height() }, time);
}

var ChatBox = React.createClass({
	handleMessageSubmit: function(message) {
		database.ref('messages/').push({
			user: MY_USER_ID,
			message: message.message
		});
	},

	loadData: function() {
		database.ref('messages/').limitToLast(30).on('value', function(snapshot) {
			var messages = [];

			snapshot.forEach(function(childSnapshot) {
				messages.push({
					id: childSnapshot.key,
					user: childSnapshot.val().user,
					message: childSnapshot.val().message
				});
		  	});

			this.setState({data: messages});
			scrollToBottom(0);
		}.bind(this));
	},

	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		this.loadData();
	},

	render: function() {
		return(
			<div>
				<div className="container-fluid">
					<div className="row">
						<div id="container-chat-box" className="col-sm-12 col-lg-8 col-lg-offset-2">
							<ul className="chat-box">
								<ChatMessages data={this.state.data} />
							</ul>
						</div>
					</div>
				</div>
				<nav className="navbar navbar-default navbar-fixed-bottom">
					<div id="container-chat-form" className="container">
						<ChatForm onMessageSubmit={this.handleMessageSubmit} />
					</div>
				</nav>
			</div>
		);
	}
});

var ChatMessages = React.createClass({
	render: function() {
		var messages = this.props.data.map(function(message) {
			return(
				<Message key={message.id} user={message.user}>{message.message}</Message>
			);
		});

		return(
			<div>{messages}</div>
		);
	}
});

var ChatForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();

        var message = this.state.message.trim();

        if (!message) {
            return;
        }

        this.props.onMessageSubmit({message: message});
        this.setState({user: null, message: ''});

        scrollToBottom(1000);
        $('input').focus();
	},

	handleMessageChange: function(e) {
		this.setState({message: e.target.value});
	},

	changeName: function() {
		var newName = window.prompt('Qual o seu nome?', MY_USER_ID);

		if (!newName) {
			return;
		}

		var myMessages = firebase.database().ref('/messages').orderByChild('user').equalTo(MY_USER_ID).once('value').then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				childSnapshot.ref.update({
					user: newName
				});
			});
		});

		MY_USER_ID = newName;
		window.localStorage['user_id'] = MY_USER_ID;
	},

	getInitialState: function() {
		return {user: null, message: ''};
	},

	componentDidMount: function() {
		scrollToBottom(0);
		$('input').focus();

		if (!MY_USER_ID) {
			MY_USER_ID = 'Anônimo' + Date.now();
			this.changeName();
		}
	},

	render: function() {
		return(
			<form className="chat-form" onSubmit={this.handleSubmit}>
                <div className="input-group">
                    <span className="input-group-btn">
						<button className="btn btn-primary btn-lg" type="button" onClick={this.changeName}>
							<i className="glyphicon glyphicon-user"></i>
						</button>
                    </span>
                    <input type="text" className="form-control input-lg" placeholder="Mensagem" value={this.state.message} onChange={this.handleMessageChange} />
                    <span className="input-group-btn">
                        <button className="btn btn-success btn-lg" type="submit">
                        	<i className="glyphicon glyphicon-send"></i>
                    	</button>
                    </span>
                </div>
            </form>
		);
	}
});

var Message = React.createClass({
	render: function() {
		return(
			<li className={this.props.user == MY_USER_ID ? 'message me' : 'message other'}>
				<p className="user">{this.props.user}</p>
				<p className="text">{this.props.children}</p>
			</li>
		);
	}
});

ReactDOM.render(<ChatBox />, document.getElementById('container'));
