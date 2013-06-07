var PORT = 9000;
var express = require("express");
var app = express();
var path = require('path');
// special handling of the root folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
  res.render('template.ejs', {
    layout:false
  });
});

app.get("/about", function(req, res){
  res.render('about.ejs', {
    layout:false
  });
});

app.get("/contact", function(req, res){
  res.render('contact.ejs', {
    layout:false
  });
});

app.get("/guide", function(req, res){
  res.render('guide.ejs', {
    layout:false
  });
});

app.get("/signin", function(req, res){
  res.render('login.ejs', {
    layout:false
  });
});

app.get("/add", function(req, res){
  res.render('add_term.ejs', {
    layout:false
  });
});
// startup this server
app.listen(process.env.PORT || PORT)
console.log("Server on port %s", PORT);
