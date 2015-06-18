//STEP 1
var ref = new Firebase("https://fbtwitchat.firebaseio.com/");
var messagesRef = ref.child('messages');
var usersRef = ref.child('users');
var currentUser = null;

//STEP 2 log user in when login button is clicked
  $('#login').on("click", function () {
    authenticate();
  });

//STEP 3
var authenticate = function() {
  usersRef.authWithOAuthPopup('twitter', function (error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      usersRef.child(user.uid).set({username: user.twitter.username, pic: user.twitter.cachedUserProfile.profile_image_url_https});
    }
  });
};
  //Save user's auth state
  usersRef.onAuth(function (user) {
    currentUser = user;
  });
// //STEP 4: Display a list of users who have logged in
usersRef.on('child_added', function (snapshot) {
  var user = snapshot.val();
  $("<div id='user'><img src=" + user.pic + "/><span id='username'>@" + user.username + "</span></div>").appendTo($('#here'));
});
// //STEP 5: Store messages in Firebase
$('#tweet-submit').on('click', function () {
  if (currentUser !== null) {
    var message = $('#msgInput').val();
    //Send the message to Firebase
    messagesRef.push({user: currentUser.uid, username: currentUser.twitter.username, message: message, published: new Date().getTime()});
    $('#msgInput').val('');
  } else {
    alert('You must login with Twitter to post!');
  }
});
// //STEP 6: Add messages to DOM in realtime
messagesRef.orderByChild("published").on('child_added', function (snapshot) {
  var message = snapshot.val();
    $('#msg-box').prepend($("<div class='msg-text'>").text(message.username).append('<br/>').append($('<span/>').text(message.message)));
});


/////this is the FIREBASE DOC ONE///////
// ref.authWithOAuthPopup("twitter", function(error, authData) {
//   if (error) {
//     console.log("Login Failed!", error);
//   } else {
//     console.log("Authenticated successfully with payload:", authData);
//   }
// });
