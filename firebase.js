var MY_USER_ID = window.localStorage['user_id'];

var config = {
	apiKey: "AIzaSyB6-oW1eRGlbYctXU7mu2CijvWgWiZKFuo",
	authDomain: "chat-do-ual.firebaseapp.com",
	databaseURL: "https://chat-do-ual.firebaseio.com",
	storageBucket: "",
};

firebase.initializeApp(config);

firebase.auth().signInAnonymously().catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	
	console.log(errorCode + ': ' + errorMessage);
});

var database = firebase.database();
