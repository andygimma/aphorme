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
// startup this server
app.listen(process.env.PORT || PORT)
console.log("Server on port %s", PORT);
