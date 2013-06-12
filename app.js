var PORT = 8080;
var express = require("express");
var mongoose = require("mongoose");
var crypto = require('crypto');

var db = mongoose.connect('mongodb://localhost/SomeDb');
// const sessions = require("client-sessions");

var Schema = mongoose.Schema;
var Users = new Schema({
  email : String,
  password_hash : String,
});

var User = mongoose.model('User', Users);

// User.find({}, function (err, docs) {
//   // docs.forEach
//   console.log(docs);
// });


var Posts = new Schema({
  name : String,
});
mongoose.model('Post', Posts);

function createNewUser(email, password_hash){
    var User = mongoose.model('User');
    var user = new User({email:email, password_hash:password_hash});
    user.save(function(err){
      console.log("saving");
        if(!err){
            console.log('User saved.');
        }
    });
}

function checkSignedIn(req) {
 console.log(req.session.session_id);
 if(typeof req.session.session_id === 'undefined' || req.session.session_id == 'None'){
   // your code here.
   console.log("false");
   return false;
 }; 
 console.log("true");
 return true;
}
  
var app = express();
var path = require('path');

var hash_salt = "9eir9234jlt90sgdj2390";

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret_key'}));
  app.use(app.router);

});
// special handling of the root folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
  console.log(req.session.session_id);
  var signed_in = checkSignedIn(req);
  res.render('template.ejs', {
    layout:false,
    signed_in: signed_in
  });
});

app.get("/about", function(req, res){
  var signed_in = checkSignedIn(req);

  res.render('about.ejs', {
    layout:false,
    signed_in: signed_in
  });
});

app.get("/contact", function(req, res){
  var signed_in = checkSignedIn(req);
  res.render('contact.ejs', {
    layout:false,
    signed_in: signed_in
  });
});

app.get("/signup", function(req, res){
  var signed_in = checkSignedIn(req);
  res.render('signup.ejs', {
    layout:false,
    signed_in: signed_in
  });
});
app.post('/signup', function(request, response){
//     console.log(request.body.password);
    var shasum = crypto.createHash('sha1');
    shasum.update(request.body.password + hash_salt);
    var d = shasum.digest('hex');
    console.log(d)
    createNewUser(request.body.email, d);

    response.redirect("/");
});

app.get("/guide", function(req, res){
  var signed_in = checkSignedIn(req);
  res.render('guide.ejs', {
    layout:false,
    signed_in: signed_in
  });
});

app.get("/signin", function(req, res){
  console.log(req.session.session_id);
  var signed_in = checkSignedIn(req);
  res.render('signin.ejs', {
    layout:false,
    signed_in: signed_in
  });
});

app.post('/signin', function(req, res){
//     console.log(request.body.password);
    var shasum = crypto.createHash('sha1');
    shasum.update(req.body.password + hash_salt);
    var d = shasum.digest('hex');
    User.find({email: req.body.email, password_hash: d}, function(err,q){
        req.session.session_id = q[0]._id;
	req.session.save();
	console.log(req.session.session_id);
        console.log(q[0]._id);
    });
    
    res.redirect("/");
});

app.get("/add", function(req, res){
  var signed_in = checkSignedIn(req);
  if (signed_in == false) {
    res.redirect('/signup');
  }
  res.render('add_term.ejs', {
    layout:false,
    signed_in: signed_in

  });
});
app.get("/logout", function(req, res){
  var signed_in = checkSignedIn(req);
  if (signed_in == false) {
    res.redirect('/signup');
  } else {
    req.session.session_id = "None";
    res.redirect('/signup');
  }

});
// startup this server
app.listen(process.env.PORT || PORT)
console.log("Server on port %s", PORT);
