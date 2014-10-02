// var app = require('express').createServer();
var express = require("express");
var app = express();
var request = require('request');
var APP_ID = '4556386',
    SECRET = 'ET1IPpkIFSqawsZSqEIG',
    REDIRECT_URI = 'http://whiteknez.ru';

app.use(express.static(__dirname + '/static'));
app.use(express.cookieParser());

app.get('/', function(req, res) {
    var swig = require("swig");
    var template = swig.compileFile("/var/www/vkapi/vk_node/templates/home.html");
    var output = template({
            pagename: 'awesome people',
            authors: ['Paul', 'Jim', 'Jane']
        });
    res.send(output);
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

var userSchema = mongoose.Schema({
    name: String,
    vkid: String,
    avatar: String,
});
var User = mongoose.model('User', userSchema);

app.get('/useradd', function(req, res) {
    var user = new User({
        name: req.params.name,
        vkid: req.params.id,
        avatar: req.params.avatar,
    });
    user.save(function(err, user) {
        if(err) return console.error(err);
        console.log('user saved');
    });
});

app.get('/userfind', function(req, res) {
    User.find(
        { vkid: req.params.userId },
        function(r) {
            res.json({
                name: r.name,
                vkid: r.vkid,
                avatar: r.avatar,
            });
        },
        function(err) {
            res.json({});
        }
    )
});

app.listen(80);